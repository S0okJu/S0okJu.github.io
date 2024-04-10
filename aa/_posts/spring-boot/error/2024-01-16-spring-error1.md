---
title: Spring Error - Repository 생성 시 Not a managed type; class java.lang.Object 오류
author: cotes
date: 2024-01-16
categories: [Web, Spring Boot]
tags: [Spring Boot, Error]
---

## Error

JPA를 상속받은 Repository를 생성하다가 발견한 문제였다.

```java
@NoRepositoryBean
public interface SpringDataMembershipRepository<MembershipJpaEntity> extends JpaRepository<MembershipJpaEntity, Long> {
}
```

에러 코드를 자세히 보면

- @EnableJpaRepositories로 정의된 Repository라는 bean이 생성되지 않았다.
- `java.lang.Object`는 적용할 수 없는 타입이다.

```
org.springframework.beans.factory.BeanCreationException:
Error creating bean with name '~~Repository'
defined in ~~Repository
defined in @EnableJpaRepositories declared on
JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration
: Not a managed type: class java.lang.Object
```

## Solution

[Jinseob 님의 블로그](https://jinseobbae.github.io/jpa/2021/12/06/jpa-repository-not-managed-type-error.html)를 참고하자면 아래와 같다.

> Object 라는 타입의 entity는 등록이 되어있지 않기때문. Object는 entity 객체가 아니니까!
> <br>Repository를 생성 할 때 명시한 entity 객체가 내부에서 entity 객체로 인식되지 않은 문제다.

즉, 나의 경우에서는 `SpringDataMembershipRepository`에서의 `MembershipJpaEntity`가 제네릭으로 구현되었고, spring은 구현된 제네릭을 Object 타입으로 인식했기 때문에 entity에 없다고 나온 것이다.

`@NoRepositoryBean` 을 사용해서 실제 사용되는 레포지토리가 아님을 명시해 오류를 해결할 수 있었다. 문제는 **나는 SpringDataMembershipRepository를 직접 사용**한다는 것이다.

```java
@NoRepositoryBean
public interface SpringDataMembershipRepository<MembershipJpaEntity> extends JpaRepository<MembershipJpaEntity, Long> {
}
```

기본적인 JpaRepository에서 제공해주는 CRUD 위주로 쓸 예정이기에 MembershipJpaEntity 제너릭은 불필요하다고 판단해 없앴다.

```java
public interface SpringDataMembershipRepository extends JpaRepository<MembershipJpaEntity, Long> {
}
```

## Reference
- [[JPA] Respository 만들 때 Not a managed type: class java.lang.Object 오류](https://jinseobbae.github.io/jpa/2021/12/06/jpa-repository-not-managed-type-error.html)
- [[Spring Data Common] Repository, @NoRepositoryBean](https://parkadd.tistory.com/107)
