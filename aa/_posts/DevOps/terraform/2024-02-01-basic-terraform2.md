---
title: Terraform 기초 맛보기 - 2. Backend 
author: cotes
date: 2024-02-01
categories: [DevOps, laC]
tags: [DevOps, Terraform]
---
## backend

Terraform Backend는 Terraform의 state(.tfstate)파일의 저장 공간을 지정하는 설정이다. 기본적으로는 로컬에 저장되지만, 설정에 따라서는 원격 저장소(S3, Terraform Cloud 등)에 저장할 수 있다. 

Terraform에서 상태 파일은 테러폼 코드와 인프라 객체를 매핑하기 위해 존재한다. 

> The primary purpose of Terraform state is to store bindings between objects in a remote system and resource instances declared in your configuration.
> 
> 출처 - [Terraform 공식 홈페이지](https://developer.hashicorp.com/terraform/language/state)
> 

테라폼이 작동되기 전에 [refresh](https://developer.hashicorp.com/terraform/cli/commands/refresh)라는 작업을 통해 테라폼 상태 파일을 업데이트한다. 테라폼 코드의 일부 리소스 블록을 삭제하게 된다면, 실제 인프라 객체에 적용(apply)하기 전에 refresh라는 작업을 통해 테라폼 상태 파일이 업데이트 되는 것이다. 

> This(refresh) won't modify your real remote objects, but it will modify the [Terraform state](https://developer.hashicorp.com/terraform/language/state).
> 
> 출처 - [Terraform 공식 홈페이지](https://developer.hashicorp.com/terraform/cli/commands/refresh) 
> 

상태 파일 내 객체와 인프라 객체와 1:1로 매핑하는 개념이기 때문에, 상태 파일이 유실되거나 일부만 잘못 설정되어도 큰 문제를 야기할 수 있다. 이러한 상황을 대비해 Backup과 Locking은 필수적으로 적용하게 된다. 

### Locking

동시에 상태 파일을 접근하게 되면 충돌이 발생하거나 인프라 설정이 꼬이게 되어 전반적으로 큰 문제가 될 수 있다. Locking을 통해 동시에 접근 상태를 막아 의도치 않는 변경을 예방해야 한다. 

### Backup

상태 파일이 유실되는 경우를 대비해서 Backup을 해야 한다. S3을 사용할때는 versioning을 사용하여 히스토리를 기억한다. 

> stack overflow에 **[Terraform fails because tfstate (S3 backend) is lost](https://stackoverflow.com/questions/54122890/terraform-fails-because-tfstate-s3-backend-is-lost)**을 읽어보는 것을 추천한다.
> 

## 실습 1. S3 Backend 만들기

해당 실습해서는 Locking하는 것을 제외했다. 

### S3 Bucket 생성

Terraform backend 정보는 apply되면 코드가 순차적으로 실행되면서 S3에 상태 파일 업로드를 시도하게 된다. 만약에 설정하지 않으면 아래와 같은 오류를 받게 된다. 

```
Error: creating S3 Bucket (tf-backend-d7mekz) ACL:
operation error S3: PutBucketAcl, https response error StatusCode: 400,
~ api error AccessControlListNotSupported: The bucket does not allow ACLs
```

[aws_s3_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket), [aws_s3_bucket_acl](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_acl)을 활용해 private S3 bucket을 생성한다. 또한 히스토리를 저장하기 위해 S3의 Versioning도 추가했다. 

공식 홈페이지에서도 Versioning 설정을 적극 권장하고 있다. 

> **Warning!** It is highly recommended that you enable [Bucket Versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/manage-versioning-examples.html) on the S3 bucket to allow for state recovery in the case of accidental deletions and human error.
> 
> 
> 출처 - [Backend Type: s3 ,Terraform, HashiCorp Developer](https://developer.hashicorp.com/terraform/language/settings/backends/s3)
{: .prompt-danger }

```hcl
resource "aws_s3_bucket" "tf_backend" {
  bucket = "d7_tf_backend"

  tags = {
    Name = "tf_backend"
  }
}

resource "aws_s3_bucket_acl" "example" {
  bucket = aws_s3_bucket.tf_backend.id
  acl    = "private"
}

# Versioning
resource "aws_s3_bucket_versioning" "versioning_example" {
  bucket = aws_s3_bucket.tf_backend.id
  versioning_configuration {
    status = "Enabled"
  }
}
```

![basic-terraform-img1](/assets/img/post/2024-02-01/basic-terraform-img1.png)
_출처 - 저자 캡쳐_

### Backend 설정

S3 생성 이후 [Hashicorp의 공식 홈페이지](https://developer.hashicorp.com/terraform/language/settings/backends/s3)를 참고하여 backend을 설정하면 된다. 

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

terraform 블록에 수정이 가하면 init를 해줘야 한다. init 후 apply을 실행시키면 아래와 같이 S3에 상태 파일이 저장되었음을 확인할 수 있다.

![basic-terraform-img2](/assets/img/post/2024-02-01/basic-terraform-img2.png)
_출처 - 저자 캡쳐_

참고로 Remote Backend을 설정하게 되면 로컬에 있는 상태 파일 내용은 사라지게 된다. 
![basic-terraform-img3](/assets/img/post/2024-02-01/basic-terraform-img3.png)
_출처 - 저자 캡쳐_

## Reference
- [Backend Type: s3, Terraform, HashiCorp Developer](https://developer.hashicorp.com/terraform/language/settings/backends/s3)
- [Backend 활용하기 :: Terraform & AWS 101](https://terraform101.inflearn.devopsart.dev/advanced/backend/)