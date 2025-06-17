// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/whoami/";
    },
  },{id: "nav-group",
          title: "group",
          description: "members of the lab or group",
          section: "Navigation",
          handler: () => {
            window.location.href = "/whoami/group/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/whoami/projects/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/whoami/repositories/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/whoami/cv/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/whoami/blog/";
          },
        },{id: "post-서버-구축기-part-5-openstack을-설치하면서-마주한-오류들",
        
          title: '서버 구축기 — Part 5. OpenStack을 설치하면서 마주한 오류들 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95%EA%B8%B0-part-5-openstack%EC%9D%84-%EC%84%A4%EC%B9%98%ED%95%98%EB%A9%B4%EC%84%9C-%EB%A7%88%EC%A3%BC%ED%95%9C-%EC%98%A4%EB%A5%98%EB%93%A4-6c4d26743df0?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "post-서버-구축기-part-4-kolla-ansible-설치-시-마주한-네트워크-문제",
        
          title: '서버 구축기 — Part 4. Kolla-ansible 설치 시 마주한 네트워크 문제 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95%EA%B8%B0-part-4-kolla-ansible-%EC%84%A4%EC%B9%98-%EC%8B%9C-%EB%A7%88%EC%A3%BC%ED%95%9C-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EB%AC%B8%EC%A0%9C-484efa8a1c38?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "post-서버-구축기-part-3-쿠버네티스에서-대시보드-접속-그리고-운영의-문제점",
        
          title: '서버 구축기 — Part 3. 쿠버네티스에서 대시보드 접속 그리고 운영의 문제점 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95%EA%B8%B0-part-3-%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4%EC%97%90%EC%84%9C-%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C-%EC%A0%91%EC%86%8D-%EA%B7%B8%EB%A6%AC%EA%B3%A0-%EC%9A%B4%EC%98%81%EC%9D%98-%EB%AC%B8%EC%A0%9C%EC%A0%90-481343ac0c3f?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "post-gitops-전환기-part-5-argocd를-활용한-cd-구성하기",
        
          title: 'GitOps 전환기 — Part 5. ArgoCD를 활용한 CD 구성하기 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/gitops-%EC%A0%84%ED%99%98%EA%B8%B0-part-5-argocd%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-cd-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0-251936a8a31f?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "post-ossca-openstack-cli-sdk-체험형-활동-후기",
        
          title: 'OSSCA: OpenStack CLI /SDK 체험형 활동 후기 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/ossca-openstack-cli-sdk-%EC%B2%B4%ED%97%98%ED%98%95-%ED%99%9C%EB%8F%99-%ED%9B%84%EA%B8%B0-dbeb653a7542?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "post-gin-예외처리-part-2-커스텀-예외처리-구현하기",
        
          title: 'Gin 예외처리 — Part 2. 커스텀 예외처리 구현하기 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/gin-%EC%98%88%EC%99%B8%EC%B2%98%EB%A6%AC-part-2-%EC%BB%A4%EC%8A%A4%ED%85%80-%EC%98%88%EC%99%B8%EC%B2%98%EB%A6%AC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-eadba0b377ee?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "post-gin-예외처리-part-1-프로젝트-코드로-살펴보는-예외처리-문제점",
        
          title: 'Gin 예외처리 — Part 1. 프로젝트 코드로 살펴보는 예외처리 문제점 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/gin-%EC%98%88%EC%99%B8%EC%B2%98%EB%A6%AC-part-1-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%BD%94%EB%93%9C%EB%A1%9C-%EC%82%B4%ED%8E%B4%EB%B3%B4%EB%8A%94-%EC%98%88%EC%99%B8%EC%B2%98%EB%A6%AC-%EB%AC%B8%EC%A0%9C%EC%A0%90-c2afdf7e7be2?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "post-testing-pytest를-활용한-단위-테스트-구현",
        
          title: 'Testing: Pytest를 활용한 단위 테스트 구현 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/testing-pytest%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%98%EC%97%AC-%EB%8B%A8%EC%9C%84-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-0a5f6c5f779c?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "post-gitops-전환기-part-4-tekton을-활용한-ci-구성하기",
        
          title: 'GitOps 전환기 — Part 4. Tekton을 활용한 CI 구성하기 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/gitops-%EC%A0%84%ED%99%98%EA%B8%B0-4-tekton%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-ci-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0-f4898483329c?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "post-gitops-전환기-part-3-gitops-파이프라인-계획-세우기",
        
          title: 'GitOps 전환기 - Part 3. GitOps 파이프라인 계획 세우기 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/s0okju-tech/gitops-%EC%A0%84%ED%99%98%EA%B8%B0-3-gitops-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EA%B3%84%ED%9A%8D-%EC%84%B8%EC%9A%B0%EA%B8%B0-4af79e4ed80f?source=rss-945c23da8b18------2", "_blank");
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/whoami/books/the_godfather/";
            },},{id: "news-first-announcement",
          title: 'First announcement!',
          description: "",
          section: "News",},{id: "projects-hexactf-challenge-controller",
          title: 'HexaCTF Challenge Controller',
          description: "Kubernetes Operator and API",
          section: "Projects",handler: () => {
              window.location.href = "/whoami/projects/hexactf/";
            },},{id: "projects-pyclassanalyzer",
          title: 'pyclassanalyzer',
          description: "pyclassanalyzer automatically analyzes the class structure of a Python project and exports the result as a diagram.",
          section: "Projects",handler: () => {
              window.location.href = "/whoami/projects/pyclassanalyzer/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%64%61%6D%65%6B%79%75%6E%67%39%38@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/S0okJu", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/DaGyeong Kim", "_blank");
        },
      },{
        id: 'social-medium',
        title: 'Medium',
        section: 'Socials',
        handler: () => {
          window.open("https://medium.com/@s0okju", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
