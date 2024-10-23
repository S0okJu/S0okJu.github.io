---
title: "Terraform - 기본 문법 익히기"
date: 2024-01-25
slug: basic-terraform-1
categories:
  - IaC
tags:
  - Terraform
  - AWS
---

## Terraform 이란

HashiCorp에서 오픈소스로 개발중인, 클라우드 및 온프로미스 인프라를 코드로 관리할 수 있는 코드이다. 인프라 환경 구성 시 선언적 코드형식을 사용하여 리소스를 생성, 수정, 삭제하여 관리가 가능한 laC(Infrastructure as Code) 프로비저닝 도구이다.

## Terraform 작동 방식

주로 Write, Plan, Apply 절차로 이뤄진다.

1. Write : Hashicorp에서 자체 개발한 HCL 언어로 스크립트 작성
2. Plan : 상태를 비교하며 변경점을 사용자에게 보여줌
3. Apply : 실행하는 단계, 순차적으로 실행
   1. 의존 관계에 따라 순서를 명시할 수 있다.

상태 비교를 통해 휴먼 에러를 줄일 수 있다. 그러나 코드의 무게가 무거워지면, 실행하는데 오래걸리는 원인이 될 수 있다. 그 외에도 다양한 단점이 존재할 것이다. 그럼에도 불구하고 생산성 측면, 종속성 그래프 등 장점들이 더 크기 때문에 사용하는 것이다.

> 클라우드 컴퓨팅 환경은 참조된 리소스가 처음의 리소스를 참조하는 순환루프 문제를 지니고 있다. 무한한 반복으로 인해 시스템이 빠르게 고갈되고, 성능이 저하된다. Terraform에서는 리소스의 참조 내용을 그래프로 보여주는 Resource Graph를 제공해주는데, 이를 활용해 순환루프 문제를 예방할 수 있다.

## 연습

> 자세한 문법은 **[Terraform Language Documentation](https://developer.hashicorp.com/terraform/language)을 참고하길 바란다.**

### 시나리오

1. AWS를 활용한다.
2. 개발, 운영 VPC를 구축한다.
   - 각 VPC에서 private, public subnet이 존재한다.
   - 외부와 통신을 위해 internet gateway와 내부 리소스끼리만 통신할 수 있는 NAT gateway를 설치한다.

![출처 - 저자](20240128_aws.png)

### 구현

1. AWS를 활용한다.

[**Terraform AWS Registry**](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)에서 제공해주는 코드를 그대로 사용한다. 나의 경우 region을 `ap-northeast-2` 로 설정했다.

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
```

1. 개발 운영 vpc를 구축한다.

vpc 모듈을 별도로 만들어 코드를 재사용했고, env를 변수로 삼아 리소스의 이름에 개발 환경을 명시하도록 했다.

```hcl
// For Dev
module "dev_vpc" {
  source = "./vpc.d"
  env = "dev"
}

// For Production
module "prd_vpc" {
  source = "./vpc.d"
  env = "prd"
}
```

모듈의 main.tf에는 public, private Subnet 그리고 NAT gateway, Internet gateway를 생성하는 코드를 작성했다.

Private Subnet을 구성하기 위해서는 라우팅 테이블이 필요하지만, 임시이므로 Private NAT Gateway만 작성했다. 여기서 **주목해야 할 점은 NAT, Internet Gateway의 경우 Subnet이 우선적으로 만들어져야 실행된다**.(만약에 그러지 않는다면 오류가 뜬다.) 그러므로 코드를 작성할때 각 리소스의 의존성을 고려해서 작성해야 한다.

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

// Configure the AWS Provider
provider "aws" {
  region = "ap-northeast-2"
}

// Create a VPC
resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "terraform_default_vpc_${var.env}"
  }
}

// public subnet
resource "aws_subnet" "public_subnet_1" {
  vpc_id     = aws_vpc.default.id
  cidr_block = "10.0.0.0/24"
  tags = {
    Name = "terraform_public_subnet_1_${var.env}"
  }
}

// private subnet
resource "aws_subnet" "private_subnet_1" {
  vpc_id     = aws_vpc.default.id
  cidr_block = "10.0.10.0/24"

  tags = {
    Name = "terraform_private_subnet_1_${var.env}"
  }
}

// private NAT
resource "aws_nat_gateway" "private_nat" {
  connectivity_type = "private"
  subnet_id         = aws_subnet.private_subnet_1.id
  tags = {
    Name = "terraform_nat_${var.env}"
  }
}

// Internet gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.default.id

  tags = {
    Name = "terraform_igw_${var.env}"
  }
}
```

## Terraform 도입과 관련된 기술 블로그

- [좌충우돌 Terraform 입문기, 우아한형제들 기술블로그](https://techblog.woowahan.com/2646/)
- [DevOps팀의 Terraform 모험](https://helloworld.kurly.com/blog/terraform-adventure/)
- [Terraform IaC 도구를 활용한 AWS 웹콘솔 클릭 노가다 해방기](https://saramin.github.io/2022-10-21-terraform/)

→ 다들 웹콘솔에서의 해방을 외치고 있었다..
