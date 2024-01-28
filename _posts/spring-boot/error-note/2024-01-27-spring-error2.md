---
title: Spring Error - Bean 등록 오류 Not a managed type; class org. ...
author: cotes
date: 2024-01-27
categories: [Spring Boot, Error]
tags: [Spring Boot, Error]
---

## Error

에러 메세지에서는 `BankingRequestAdapter` 가 등록되지 않았다고 뜬다.

```
org.springframework.beans.factory.UnsatisfiedDependencyException:
Error creating bean with name 'BankingRequestAdapter' defined in URL
[jar:nested:/app.jar/!BOOT-INF/classes/!/org/pay/banking/adapter/out/
persistence/BankingRequestAdapter.class]:
Unsatisfied dependency expressed through constructor parameter 0:
Error creating bean with name 'BankingRequestRepository'
defined in org.pay.banking.adapter.out.persistence.BankingRequestRepository defined in @EnableJpaRepositories
declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration:
Not a managed type: class org.pay.banking.adapter.out.persistence.BankingJpaEntity
```

## Solution

보통 위와 같은 에러 메세지가 나오면 대부분 아래와 같은 해결책이 제시된다.

- 빈을 등록하는 어노테이션이 잘 설정되어 있는지 (ex @Entity 등..)
- JpaRepository에 상속받은 인터페이스의 구현 메서드 이름이 잘 설정되었는지 (ex. findALL → findAll)

하지만 나는 저 두 가지 이유가 아니였다. 문제의 원인은 **BankJpaEntity를 다른 패키지에 선언**했다는 것이다. 그래서 @Entity를 인식하지 못해 빈이 등록되지 않았다고 하는 것이다.

```
Not a managed type: class org.pay.banking.adapter.out.persistence.BankingJpaEntity
```

나는 다른 패키지에 있는 파일을 복붙해서 새로운 패키지에 약간 수정했는데, 이 과정에서 패키지를 고려하지 않았던 것 같다. 물론 `@EntityScan`을 통해 외부 패키지에 있는 entity를 사용할 수 있다. 그러나 온전한 나의 실수이므로 패키지를 올바르게 수정했다.
