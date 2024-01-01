import * as dayjs from 'dayjs';

/**
 * private set property decorator
 * 필드명이 _로 시작하는 지역변수가 있는 도메인 entity 객체 생성 시 Object.assign을 사용하기 위해 만든 데코레이터 입니다.
 * private 필드명이 _로 시작하는 경우, _를 제거한 필드명으로 값을 셋팅할 수 있도록 합니다.
 * @param target
 * @param propertyKey
 */
export const PrivateSetProperty = (target: any, propertyKey: string) => {
  let exposedPropertyKey = propertyKey;
  if (exposedPropertyKey.startsWith('_')) {
    exposedPropertyKey = exposedPropertyKey.substring(1);
  }

  // Object.defineProperty로 객체의 속성을 동적으로 정의 합니다.
  Object.defineProperty(target, exposedPropertyKey, {
    get() {
      return this[propertyKey];
    },
    set(value: any) {
      // Date 타입은 dayjs.Dayjs 타입으로 변경 합니다.
      if (value instanceof Date) {
        value = dayjs(value);
      }
      this[propertyKey] = value;
      // currentValue = value;
    },
  });

  // Get은 아래 처럼 설정해도 IDE에서 자동완성이 되지 않습니다. 그러므로 entity에서 get을 추가 합니다.
  // Object.defineProperty(target, exposedPropertyKey, {
  //   get() {
  //     return currentValue;
  //   },
  // });
};
