# 연구과제

## Rule

1. Msg에서 공용으로 사용하는 Handler와 비지니스 로직을 처리하는 Handler가 각기 다르다.

2. ecma2022부터 자바스크립트에서 private 접근제어자인 #이 추가 되었다. 하지만 protected가 없어, typescript에서 제공하는 접근제어자를 사용하도록 합니다.

## TODO

1. 상품-결제 기능 개발. 이 때 실패 시 보상 트랜잭션 구현을 위해 Saga 사용하기.

2. helm, 쿠버네티스를 이용한 개발/배포
   어느 클라우드 회사걸 사용할지 고민

## ORM

### Drizzle Orm

- [list of commands](https://orm.drizzle.team/kit-docs/commands#introspect--pull)
  - migration: `drizzle-kit generate:pg`
    - drizzle-kit generate:{dialect} lets you generate migrations based on you Drizzle schema.
  - Introspect / Pull: `drizzle-kit introspect:pg`
    - drizzle-kit introspect:{dialect} command lets you pull DDL from existing database and generate schema.ts file in matter of seconds.
  - push: `drizzle-kit push:pg`
    - drizzle-kit push:{dialect} lets you push your schema changes directly to the database and omit managing SQL migration files.
  - drop migration: `drizzle-kit drop`
    - drizzle-kit drop lets you delete previously generated migrations from migrations folder
  - check: `drizzle-kit check:pg` - drizzle-kit check:{dialect} is a very powerful tool for you to check consistency of your migrations.
    That’s extremely useful when you have multiple people on the project, altering database schema on different branches.
    Drizzle Kit will check for all collisions and inconsistencies.
