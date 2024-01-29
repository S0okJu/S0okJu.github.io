---
title: Terraform Error - 강제 Backend S3 삭제로 인한 NoSuchBucket 오류 해결 
author: cotes
date: 2024-01-29
categories: [DevOps, Terraform]
tags: [DevOps, Terraform, Error]
---

## Error

사건의 시작은 상태 파일이 있는 S3을 삭제하려고 시도했을 때였다. 바로 삭제하려고 했으나 version 파일이 남아있다는 이유로 정상적으로 삭제되지 않았다. 그래서 `force_destory=true` 로 설정한 후에 apply 후 destory를 시켰다. 

> State 파일을 S3에 저장하는 간단한 연습 코드라 force_destory를 설정한 것이지 가급적 쓰는 것을 피하자.
{: .prompt-danger }

```hcl
resource "aws_s3_bucket" "tf_backend" {
  bucket        = "tf-backend-d7mekz"
  force_destroy = true

  tags = {
    Name = "tf_backend"
  }
}
```

여기서 문제는 terraform block에 있는 삭제된 s3로 저장된 backend를 제대로 지우지 않았다는 것이다. 

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "tf-backend-d7mekz"
    key    = "terraform.tfstate"
    region = "ap-northeast-2"
  }
}
```

terraform init 할때마다 S3 버킷이 없다는 오류가 뜨는 것이다. 

```
│ Error: Error inspecting states in the "s3" backend:
│     S3 bucket "tf-backend-d7mekz" does not exist.
│ 
│ The referenced S3 bucket must have been previously created. If the S3 bucket
│ was created within the last minute, please wait for a minute or two and try
│ again.
│ 
│ Error: operation error S3: ListObjectsV2, https response error StatusCode: 404, 
		... NoSuchBucket: 
│ 
│ 
│ Prior to changing backends, Terraform inspects the source and destination
│ states to determine what kind of migration steps need to be taken, if any.
│ Terraform failed to load the states. The data in both the source and the
│ destination remain unmodified. Please resolve the above error and try again.
│ 
│
```

root 폴더에 `.terraform` 내 상태 파일(terraform.tfstate)을 보면 backend S3을 볼 수 있다. 즉 .terraform 디렉토리를 수정하면 될 것 같다. 

![terraform1](/assets/img/post/2024-01-29/20240129-terraform1.png)
_출처 - 저자 캡쳐_

## 해결

[StackOverflow](https://stackoverflow.com/questions/50844085/error-inspecting-states-in-the-s3-backend-nosuchbucket-the-specified-bucket)에 의하면 `.terraform` 파일을 삭제하고 terraform init을 하면 된다.

### .terraform
[Terraform 공식 홈페이지](https://developer.hashicorp.com/terraform/cli/init#working-directory-contents)에서는 .terraform에 대해 아래와 같이 설명했다. 

> A hidden `.terraform` directory, which Terraform uses to manage cached provider plugins and modules, record which [workspace](https://developer.hashicorp.com/terraform/cli/workspaces) is currently active, and **record the last known backend configuration** in case it needs to migrate state on the next run. This directory is automatically managed by Terraform, and is created during initialization.
 
.terraform 디렉토리는 init할때 값이 설정되며, terraform.tfstate에는 backend 설정값이 저장되어 있다.

### 삭제 시 순서를 고려하자

나의 경우에는 단순한 연습 문제로 backend를 remote → local로 바꿨다. 그러나 실제 프로젝트에서는 backend를 local로 설정하는 일은 없어 나와 같은 문제는 발생하지 않을 것 같다.

그래도 이 경험을 통해 교훈을 얻었다. **삭제할때도 순서를 고려하자**.

## Reference
- [StackOverflow, Error inspecting states in the "s3" backend: NoSuchBucket: The specified bucket does not exist](https://stackoverflow.com/questions/50844085/error-inspecting-states-in-the-s3-backend-nosuchbucket-the-specified-bucket)
- [Terraform, Initializing Working Directories](https://developer.hashicorp.com/terraform/cli/init#working-directory-contents)