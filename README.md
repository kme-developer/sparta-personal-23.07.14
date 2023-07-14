```

# API

회원가입 (POST)
=> /signup

Log-in (POST)
=> /login

Log-out (POST)
=> /logout

사용자 정보 조회 (GET)
=> /userInfo

사용자 정보 수정 (PUT)
=> /userInfo

회원탈퇴 (DELETE)
=> /userInfo

```

```

2023.07.14
├─ controllers
│  └─ users.controller.js
├─ services
│  └─ users.sevice.js
├─ ropositories
│  └─ users.repository.js
├─ middlewares
│  └─ authMiddleware.js
├─ migrations
│  ├─ 20230704025827-create_users_table.js
│  └─ 20230704025912-create_userinfos_table.js
├─ models
│  ├─ index.js
│  ├─ userinfos.js
│  └─ users.js
├─ routes
│  └─ usersRoute.js
├─ .gitignore
├─ .prettierrc.js
├─ app.js
├─ ERD.JPG
├─ package-lock.json
├─ package.json
└─ seeders

```
