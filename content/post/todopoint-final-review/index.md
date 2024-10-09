---
title: "왜 TodoPoint 프로젝트를 실패했는가?"
date: 2024-10-09
slug: todopoint-final-review
tags:
  - Go
  - Docker
  - Gin
categories:
  - TodoPoint
---

## TodoPoint 프로젝트에 대한 소개

Todopoint란 문자 그대로 할 일을 완수하면 포인트를 지급하는 애플리케이션 입니다. 계획을 제대로 완수하지 못한 사람들에게 강제성을 부여하고자 기획한 프로젝트입니다.

![초기에 기획한 구성도](image.png)

프로젝트 기획의 창의성의 별개로 개인의 MSA에 대한 학습과 기술 역량을 향상하기 위해 시작한 프로젝트였습니다. 실제로 애플리케이션을 작동시키기 위해 쿠버네티스 홈 서버를 구축하기도 했습니다. 그러나 3개월이란 긴 시간 동안 예상치 못한 삽질로 제대로 마무리하지 못했습니다.

지금부터 프로젝트 실패의 원인을 소개하겠습니다.

## 잘못된 언어 선택

저는 웹 애플리케이션을 제작하면서 Go라는 언어와 Gin 웹애플리케이션 프레임워크를 사용했습니다. 그때 당시 Go 언어를 한번도 못해봤습니다. 단순하게 해보고 싶은 언어라서 선택했습니다. 이러한 선택으로 인해 예상치 못한 시간을 쓰게 되었습니다.

### 새로운 기술을 사용할때는 고민해보자

앞서 말했듯이 그때 당시 Go언어는 처음이었습니다. 준비단계로 간단하게 Go 언어 문법만 익히고 바로 Gin을 쓰게 되었습니다.  
Go는 독특한 문법 체계를 가지고 있어 다른 언어에 비해 응용하기 어려웠습니다. 특히 구조를 짜는데 어려움을 겪었습니다. 객체지향 언어지만 흔히 알고 있는 클래스 기반 객체지향 패턴과는 다르다는 점이 어려웠습니다.

```go
//go:generate mockery --name Store --case underscore
type Store interface {
	Create(ctx *gin.Context, info *data.UserInfo) error
	FindOne(ctx *gin.Context, uid int) (*data.Me, error)
	Update(ctx *gin.Context, uid int, me data.Me) error
}

type UserService struct {
	store Store
}

func NewUserService(store Store) *UserService {
	return &UserService{
		store: store,
	}
}

func (s *UserService) Update(ctx *gin.Context, uid int, me data.Me) (*httputils.BaseResponse, *httputils.NetError) {
	err := s.store.Update(ctx, uid, me)
	if err != nil {
		return nil, httputils.NewNetError(codes.UpdateFailed, err)
	}

	return httputils.NewSuccessBaseResponse(nil), nil
}
```

결국 깃허브에 베스트 케이스를 찾아다니면서 대략 한달 동안 코드를 2번 새로 만들었습니다. 주로 Error 구조체, 패키지 구조 등 부족하다고 생각하는 부분을 전부 다 수정했습니다.

![버전이 2개인 서비스](image-1.png)

각각의 서비스를 만드는 것은 어렵지 않았습니다. 그러나 **공통 모듈**이라는 것을 만들려고 했을때 모든 것이 꼬이기 시작했습니다.
공통 모듈에는 필요한 인증 미들웨어나 전체적으로 통일된 형식의 구조체(http response값, 오류 메세지 타입 등)가 포함되어 있습니다.
Go는 외부 라이브러리 저장소로 github를 주로 사용합니다. 공통 모듈을 github에 업로드하여 애플리케이션을 빌드할때마다 제작한 공통 모듈을 다운로드 받고 사용해야 할까요? 개발 초기 단계라 공통 모듈 수정이 잦습니다. 즉, 수정사항을 반영할때 비효율적입니다.

이때 당시 "공통 모듈이 필요한가?"에 대해 많이 생각했던 것 같습니다. 저는 개인적으로 필요하다고 생각했습니다. 요구사항에 따라 다르겠지만 공통적인 부분이 많을수록 모듈화하여 관리하는 것이 효율적이라고 생각했기 때문이었습니다. 그대신어느정도 구조가 완성된 상태에서 사용해야 한다고 생각이 들었습니다.

외부 다운로드 외에 다른 방법이 있었습니다. Go는 Workspace라는 개념이 있으며 go.work 파일을 통해 모듈을 포함시킬 수 있습니다. 그래서 동일 프로젝트 폴더 내에 모듈을 만들어 workspace로 명시적으로 포함시켰습니다.

```mod
go 1.22.1

use (
	.
	./../../modules/v2/common
	../../modules/v2/database/d7mysql
	../../modules/v2/database/d7redis
)
```

> Workspace는 로컬 사용에 적합하다는 의견이 있습니다.[^1]

만든 Go 애플리케이션을 컨테이너로 실행시키기 위해서는 Dockerfile로 만들어야 합니다.  
우선 go 애플리케이션으로 빌드하기 위해서는 공통 모듈을 모두 복사하고 `go work use` 를 수행한 후 `$GOPATH/src`에 모듈을 저장하는 작업이 필요합니다. 그러나 개발 환경과 도커 내부 환경이 달라서 도커 내부에 go work use를 할 수 있도록 Dockerfile를 만들었습니다.

```Dockerfile
# Stage 1: Build modules
FROM golang:1.22 as modules-build

COPY modules/v2/common /modules/common
COPY modules/v2/database/d7redis /modules/database/d7redis
COPY modules/v2/database/d7mysql /modules/database/d7mysql

WORKDIR /app
COPY scripts/init_workspace.sh /app/init_workspace.sh
COPY auth-service/v2/workspace.packages.json /app/workspace.packages.json

RUN apt-get update && apt-get install -y jq
RUN chmod +x init_workspace.sh && ./init_workspace.sh
RUN cat go.work

COPY auth-service/v2 /app
COPY auth-service/v2/go.mod /app/go.mod
COPY auth-service/v2/go.sum /app/go.sum

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /bin/main main.go

# stage 2
FROM scratch

COPY --from=modules-build /bin/main /bin/main
EXPOSE 3001

CMD ["/bin/main"]
```

결국 해결하지 못했습니다. 경로 문제, 모듈이 제대로 설정되지 않는 문제 등 원인은 다양했습니다.  
해결책을 모색하다가 느낀건 "내가 Go를 적절하게 사용한 것이 맞나?" 였습니다. 그리고 거슬러 올라가 **MSA를 채택한 것이 문제였다는 결론에 도달**했습니다.

## 마이크로서비스 하지 말았어야 했다.

결국 모든 원인은 **아무 생각 없이 마이크로서비스를 도입**했기 때문이라고 생각합니다. 그때 당시 MSA라고 불리는 용어가 트렌드처럼 떠올랐고, 규모가 있는 기업이 해당 능력을 요구하면서 능력이 필수라고 생각했습니다.
**왜 규모가 있는 기업이 MSA를 사용하는가?** 에 대한 역질문을 생각하지 못한 것 같습니다.  
기업이 MSA를 채택한 이유는 **서비스 간 결합도를 낮춰 요구사항에 대한 빠른 대처**하기 위해서 라고 생각합니다.
제 프로젝트는 MSA로 할만큼 큰 서비스가 아니였고 이를 구현할 능력을 가지고 있지 않았습니다. 즉 **오버 엔지니어링**을 한 것이었습니다.

## 실패 이후의 새로운 시작

이 프로젝트를 수행하면서 많은 시간을 사용했습니다. 노력 끝에 완성된 것이 하나 없으니 한편으로는 아쉽다는 생각이 들었습니다.  
한편으로 프로젝트가 저에게는 새로운 시작을 알렸던 것 같습니다.  
**"기초부터 공부할 예정이라면 기본적인 구성부터 공부해보자."** 라는 생각이 들었습니다. 이후로 저는 기초부터 공부할 수 있도록 작은 프로젝트를 기획하게 되었습니다.

[^1]: https://www.reddit.com/r/golang/comments/19517hq/what_are_you_using_go_workspaces_for_if_at_all/
