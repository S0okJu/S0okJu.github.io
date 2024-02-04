---
title: Terraform 기초 맛보기 - 3. Workspace
author: cotes
date: 2024-02-04
categories: [DevOps, laC]
tags: [DevOps, Terraform]
---
## Introduction

하나의 프로젝트에는 하나의 상태 파일이 존재한다. 그러면 궁금증을 가지게 된다.

> Q. 만약에 개발, 운영 코드를 짠다고 한다면 어떻게 짤까?
> <br>A. 공통의 기능이 포함된 root 모듈을 만든 후 운영, 개발 프로젝트를 만든다.

공통의 인프라 리소스가 포함된 모듈 생성할 것이다. 별도의 모듈을 생성하게 된다면 공통 모듈의 상태 관리 문제를 빼놓을 수 없을 것이다.

개발, 운영 코드를 하나의 프로젝트에 구현하게 되면 환경에 따라 다르게 실행되는 부분이 존재하게 된다. 결국 이를 해결하기 위한 조건문이 코드를 더 복잡하게 만들 수 있을 것이다.

운영, 개발 프로젝트를 분리하는 것도 문제이다. 개발이 완료된 후에는 운영에 옮겨야 하는데 개발자가 일리리 코드를 옮기는 것은 바람직하지 않을 것이다.(사람은 누구나 실수를 하게 된다.)
Terraform은 이러한 문제를 해결하기 위해 [Workspace](https://developer.hashicorp.com/terraform/language/state/workspaces)라는 개념을 도입했다.

## Workspace
Terraform은 위와 같은 문제점을 해결하기 위해 Workspace을 도입하게 되었다. Workspace는 하나의 프로젝트에 여러개의 상태파일을 관리할 수 있게 되었다. 간단하게 말해서 Workspace는  **상태 파일을 관리하는 그릇**이라고 보면 된다. 


> 자세한 명령어는 [공식 홈페이지](https://developer.hashicorp.com/terraform/cli/commands/workspace)를 참고하길 바란다.
{: .prompt-info }

## Multiple Workspace Backend

상태 파일을 관리하기 위해 Remote Backend를 사용한다. [공식 홈페이지](https://developer.hashicorp.com/terraform/language/state/workspaces#backends-supporting-multiple-workspaces)에 의하면 아래의 서비스만 multiple Backend를 지원해준다.
- [AzureRM](https://developer.hashicorp.com/terraform/language/settings/backends/azurerm)
- [Consul](https://developer.hashicorp.com/terraform/language/settings/backends/consul)
- [COS](https://developer.hashicorp.com/terraform/language/settings/backends/cos)
- [GCS](https://developer.hashicorp.com/terraform/language/settings/backends/gcs)
- [Kubernetes](https://developer.hashicorp.com/terraform/language/settings/backends/kubernetes)
- [Local](https://developer.hashicorp.com/terraform/language/settings/backends/local)
- [OSS](https://developer.hashicorp.com/terraform/language/settings/backends/oss)
- [Postgres](https://developer.hashicorp.com/terraform/language/settings/backends/pg)
- [Remote](https://developer.hashicorp.com/terraform/language/settings/backends/remote)
- [S3](https://developer.hashicorp.com/terraform/language/settings/backends/s3)

## Example 

#### 요구사항 
1. S3에 Multiple Backend를 설정한다.
2. 실수를 줄이기 위해 default을 dev로 설정한다. 
3. 변수를 활용하여 dev, prd Workspace를 분리한다. 

#### 코드 
terraform block에는 어느때와 다름없이 S3 Backend를 설정하면 된다. 
S3로 Multiple Backend를 설정하게 되면 `env:/` 하위 폴더에 워크 스페이스에 맞게 상태 파일이 저장된다. 하지만 경우에 따라서는 env 파일명을 바꾸고 싶을 것이다. 그럴때 `workspace_key_prefix`를 사용한다. 

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket               = "tf-backend-d7mekz"
    key                  = "terraform.tfstate"
    region               = "ap-northeast-2"
    workspace_key_prefix = "temp"
  }
}
```

변수를 활용해 default를 dev Workspace로 지정한다. 

```hcl
variable "env" {
  type = "string"
  default = "dev"
}
```


workspace 명을 변수로 지정하여 공통의 모듈에 대입한다. 

```hcl
module "main_vpc" {
  source = "./custom_vpc"
  env    = terraform.workspace
}
```

변수를 활용해 workspace에 맞는 리소스 이름을 지정했다. 

> Count를 사용하여 특정 Workspace에 리소스를 실행하지 않도록 구현할 수 있다. 
> ```
>  count = var.env == "default" ? 1 : 0
> ```
{: .prompt-info }

```hcl 
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "ap-northeast-2"
}

# Create a VPC
resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "terraform_default_vpc_${var.env}"
  }
}

resource "aws_subnet" "public_subnet_1" {
  vpc_id            = aws_vpc.default.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = local.az_a
  tags = {
    Name = "terraform_public_subnet_1_${var.env}"
  }
}

resource "aws_nat_gateway" "public_nat" {
  connectivity_type = "public"
  subnet_id         = aws_subnet.public_subnet_1[0].id
}

resource "aws_subnet" "private_subnet_1" {
  vpc_id            = aws_vpc.default.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = local.az_a

  tags = {
    Name = "terraform_private_subnet_1_${var.env}"
  }
}
```

## Conclusion

다양한 환경을 하나의 상태 파일로 관리하는 것은 쉽지 않다. 그래서 Terraform은 이러한 문제를 위해 환경에 따른 상태 파일을 보관할 수 있도록 Workspace을 도입하게 되었다. 다만 Workspace을 무조건 서로 다른 환경을 분리할때 사용하는 것이 아니다. **유사하지만 다른 환경에서 인프라를 운용해야 할 때 사용**해야 한다. 

## Reference 
- [Terraform의 Workspace를 이용해 배포 환경 분리하기](https://medium.com/@blaswan/terraform-workspaces-for-deployment-environments-2deff99356f6)
- [Terraform Workspaces](https://developer.hashicorp.com/terraform/language/state/workspaces)
