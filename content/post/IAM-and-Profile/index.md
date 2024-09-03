---
title: "AWS - IAM 그리고 Profile"
date: 2024-04-16
slug: iam-and-profile
tags:
  - AWS
---

## Introduction

Terraform 코드를 분석하고 있었다. 어디에서는 IAM을 쓰고, 어디에서는 Profile을 쓴다. 과연 그 둘의 차이점은 무엇일까? 알아보도록 하자!

## Profile

Amazon Ec2는 IAM role을 가진 profile을 사용하게 된다.

### 질문 1. awscli를 통해 profile을 지정할 수 있는데, 이것도 Instance Profile인가?

> If you use the AWS CLI, API, or an AWS SDK to create a role, you create the role and instance profile as separate actions, with potentially different names. If you then use the AWS CLI, API, or an AWS SDK to launch an instance with an IAM role or to attach an IAM role to an instance, specify the instance profile name.
> 출처 - [공식 문서](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html)

- 질문이 잘못되었다. EC2는 해당 IAM Role을 가진 Profile을 사용한다. 그래서 awscli의 경우 --profile을 통해 직접 profile 이름을 지정할 수 있다.

## 왜 필요할까?

> aws cli를 사용할 때 profile 기능을 이용하면 여러개의 자격 증명을 등록하고 스위칭해서 효율적으로 사용할 수 있습니다.
>
> 출처 - https://cloudest.oopy.io/posting/101

### 질문 2. IAM Role과의 차이점은?

Profile이 필요한 이유는 여러개의 자격 증명을 등록하고 스위칭해서 효율적으로 사용하기 위함이라고 했다. 특징을 봤을때 IAM의 Role과 비슷해 보였다.

> **Roles are designed to be “assumed” by other principals** which do define “who am I?”, such as users, Amazon services, and EC2 instances
> **An instance profile, on the other hand, defines “who am I?”** Just like an IAM user represents a person, an instance profile represents EC2 instances. The only permissions an EC2 instance profile has is the power to assume a role.
>
> 출처 - https://www.quora.com/In-AWS-what-is-the-difference-between-a-role-and-an-instance-profile

IAM Role은 무엇을 할 수 있는지에 대한 행위를 정의하는 것이라면 <mark class="hltr-dark-green">Profile Instance는 "누가 만들었는지를 정의하기" 위함</mark>이라면 보면 된다.

## Conclusion

- 내가 이러한 궁금증을 가지게 된 것은 IAM을 한사람에게만 부여된다고 생각했기 때문이었다. 그런 맥락에서는 profile이 필요 없기 때문이다.

## Reference

- https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html
