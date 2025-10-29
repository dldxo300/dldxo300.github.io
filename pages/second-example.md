---
title: JavaScript 기초 개념 정리
date: 2025-01-27
tags: ["JavaScript", "프로그래밍", "기초"]
category: "프로그래밍"
description: "JavaScript의 핵심 개념들을 정리해봅니다."
---

# JavaScript 기초 개념 정리 📚

JavaScript를 처음 배우는 분들을 위해 핵심 개념들을 정리해보았습니다. 이 글에서는 변수, 함수, 객체 등의 기본 개념부터 ES6+의 새로운 기능까지 다루어보겠습니다.

## 1. 변수와 데이터 타입

JavaScript에서 변수를 선언하는 방법은 크게 세 가지가 있습니다:

### var (오래된 방식)
```javascript
var name = "홍길동";
var age = 25;
```

### let (블록 스코프)
```javascript
let message = "안녕하세요!";
if (true) {
  let message = "블록 안"; // 다른 변수
  console.log(message); // "블록 안"
}
console.log(message); // "안녕하세요!"
```

### const (상수)
```javascript
const PI = 3.14159;
const CONFIG = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};
```

## 2. 함수

JavaScript에서 함수를 정의하는 다양한 방법:

### 함수 선언식
```javascript
function greet(name) {
  return `안녕하세요, ${name}님!`;
}
```

### 함수 표현식
```javascript
const greet = function(name) {
  return `안녕하세요, ${name}님!`;
};
```

### 화살표 함수 (ES6+)
```javascript
const greet = (name) => `안녕하세요, ${name}님!`;

// 여러 줄의 경우
const calculateArea = (width, height) => {
  const area = width * height;
  return area;
};
```

## 3. 객체와 배열

### 객체
```javascript
const person = {
  name: "김철수",
  age: 30,
  hobbies: ["독서", "코딩", "여행"],
  greet() {
    return `안녕하세요, 저는 ${this.name}입니다.`;
  }
};

// 속성 접근
console.log(person.name); // "김철수"
console.log(person['age']); // 30

// 메서드 호출
console.log(person.greet()); // "안녕하세요, 저는 김철수입니다."
```

### 배열
```javascript
const numbers = [1, 2, 3, 4, 5];
const fruits = ["사과", "바나나", "오렌지"];

// 배열 메서드
numbers.push(6); // [1, 2, 3, 4, 5, 6]
numbers.pop(); // 6, 배열은 [1, 2, 3, 4, 5]

const doubled = numbers.map(num => num * 2); // [2, 4, 6, 8, 10]
const evenNumbers = numbers.filter(num => num % 2 === 0); // [2, 4]
```

## 4. 비동기 프로그래밍

JavaScript의 비동기 처리 방식:

### Promise
```javascript
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    // API 호출 시뮬레이션
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: "사용자" + userId });
      } else {
        reject(new Error("유효하지 않은 사용자 ID"));
      }
    }, 1000);
  });
}

// Promise 사용
fetchUserData(1)
  .then(user => {
    console.log("사용자 정보:", user);
  })
  .catch(error => {
    console.error("에러:", error);
  });
```

### async/await (ES8)
```javascript
async function getUserInfo(userId) {
  try {
    const user = await fetchUserData(userId);
    console.log("사용자 정보:", user);
    return user;
  } catch (error) {
    console.error("에러 발생:", error);
    throw error;
  }
}

// 사용
getUserInfo(1).then(user => {
  console.log("최종 결과:", user);
});
```

## 5. 모던 JavaScript 기능

### 구조 분해 할당 (Destructuring)
```javascript
// 배열 구조 분해
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first, second, rest); // 1, 2, [3, 4, 5]

// 객체 구조 분해
const { name, age, hobbies } = person;
console.log(name, age); // "김철수", 30

// 기본값 설정
const { nickname = "익명" } = person;
console.log(nickname); // "익명"
```

### 스프레드 연산자 (Spread Operator)
```javascript
// 배열 복사 및 병합
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 객체 복사 및 병합
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }
```

## 6. 실전 예제: Todo 앱 데이터 관리

간단한 Todo 앱의 데이터 관리를 위한 코드 예제:

```javascript
class TodoManager {
  constructor() {
    this.todos = [];
    this.nextId = 1;
  }

  // Todo 추가
  addTodo(title, description = '') {
    const todo = {
      id: this.nextId++,
      title,
      description,
      completed: false,
      createdAt: new Date()
    };
    this.todos.push(todo);
    return todo;
  }

  // Todo 완료 토글
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      return todo;
    }
    return null;
  }

  // 완료된 Todo들 가져오기
  getCompletedTodos() {
    return this.todos.filter(todo => todo.completed);
  }

  // 미완료 Todo들 가져오기
  getPendingTodos() {
    return this.todos.filter(todo => !todo.completed);
  }

  // Todo 삭제
  removeTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index > -1) {
      return this.todos.splice(index, 1)[0];
    }
    return null;
  }
}

// 사용 예제
const todoManager = new TodoManager();

todoManager.addTodo("JavaScript 공부", "기초 개념 복습");
todoManager.addTodo("프로젝트 계획 세우기", "다음 프로젝트 아이디어 정리");

console.log("모든 Todo:", todoManager.todos);
console.log("미완료 Todo:", todoManager.getPendingTodos());
```

## 마무리하며

JavaScript는 계속 발전하는 언어입니다. ES6+의 새로운 기능들을 적극적으로 활용하면 더 깔끔하고 효율적인 코드를 작성할 수 있습니다.

이 글에서 다룬 개념들이 JavaScript 학습에 도움이 되셨기를 바랍니다. 실제 프로젝트에서 이러한 개념들을 적용해보면서 더 깊이 이해해보세요!

다음 글에서는 React나 Vue.js 같은 프론트엔드 프레임워크에 대해 다뤄보겠습니다. 👋
