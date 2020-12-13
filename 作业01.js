 /**
* 简答题
* 1.1 解决耗时任务阻塞执行，通过回调方式处理耗时执行结果
* 2.2 eventLoop 是js 循环消息队列 将里边任务推入js执行栈
* 2.3 消息队列 存储异步回调 即待办任务
* 2.4 消息队列 分为两种任务类型 即 宏任务【macrotasks】 & 微任务【microtasks】 eventLoop 会先查询 microtasks将其所有任务执行完毕后在查询macrotasks如果执行macrotasks中有microtasks任务则下次查询依旧会先执行完microtasks列队任务在查询macrotasks 如此反复 直到消息列队[两个 Queue]无任务;  一个宏任务可以携带多个微任务
*
* 代码题
* 1.-----------------------------------------------------------------------
* 改造
  new Promise((res, err)=>{
    setTimeout(()=>{
      console.log(1)
      res();
    },10)
  }).then(res => {
    return new Promise((res, err)=>{
      setTimeout(()=>{
        console.log(2)
        res();
      },10)
    })
  }).then(res => {
      setTimeout(()=>{
        console.log(3)
      },10)
  })
  2.---------------------------------

 const fp = require('lodash/fp');
 const cars = [
   {"name": "111", horsepower: 660, dollar_value: 20000,in_stock: true},
   {"name": "222", horsepower: 660, dollar_value: 30000,in_stock: true},
   {"name": "333", horsepower: 660, dollar_value: 40000,in_stock: false},
   {"name": "444", horsepower: 660, dollar_value: 50000,in_stock: true},
   {"name": "555", horsepower: 660, dollar_value: 60000,in_stock: false}
 ]

 // 2.1
 // const prop = fp.curry(fp.prop);
 // const val = fp.flowRight(fp.prop('in_stock'),fp.last)(cars)
 // console.log(val)
 // 2.2
 // const val = fp.flowRight(fp.prop('name'),fp.first)(cars)
 // console.log(val)
 // 2.3
 // let _average = function (xs){
 //   return fp.reduce(fp.add, 0, xs)/xs.length
 // }
*/
/*
  // 改造前
 let averageDollarValue = function (cars){
   let dollar_value = fp.map(function (car){
     return car.dollar_value
   },cars);
   return _average(dollar_value)
 }
 // 改造后
 let averageDollarValue = function (cars){
   return fp.flowRight(_average,fp.map(car => car.dollar_value))(cars)
 }
 console.log(averageDollarValue(cars))
 */
 /*
 // 2.4
  // let _underscore = fp.replace(/\W+/g, '_');
  // let sanitizeNames = function (arr){
  //   return fp.map(val => _underscore(val))(arr);
  // }
  // console.log(sanitizeNames(['holle word','test  wq']))
*/

/*
  3.----------------
*/

// const fp = require('lodash/fp');
// const {Maybe , Container} = require('./support.js')

// 3.1
// let maybe = Maybe.of([5,6,1]);
// let ex1 = () => {
//   return maybe.map(res => {
//     return fp.map(fp.add(1),res)
//   }).map(res=>{
//     console.log(res)
//   })
// }
// ex1();

// 3.2
// let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
// let ex2 = () => {
//   xs.map( res=> {
//     return fp.first(res)
//   }).map(res=> {
//     console.log(res)
//   })
// }
// ex2()

// 3.3
// let safeProp = fp.curry(function(x, o){
//     return Maybe.of(o[x])
// })
// let user = { id: 2, name: 'Albert' }
// let ex3 = (list) => {
//   let vals = null;
//   return fp.flowRight(fp.first, res=>(res.map(v => (vals = v, v)),vals),safeProp('name'))(list)
// }
// console.log(ex3(user))

// 3.4
// const fp = require('lodash/fp')
// const {Maybe, Container} = require('./support')
// let ex4 = function (n){
//   return Maybe.of(n).map(parseInt)
// }
// console.log(ex4(''))


/*
 4 --------------------------

  * 1. 是个构造函数
  * 2. 传入一个可执行函数 函数的入参第一个为 fullFill函数 第二个为 reject函数；  函数立即执行，  参数函数异步执行
  * 3. 状态一旦更改就不可以变更  只能 pending => fulfilled 或者  pending => rejected
  * 4. then 的时候要处理入参的情况 successCallback 和failCallback 均可能为非函数
  *      默认的 failCallback 一定要将异常抛出， 这样下一个promise便可将其捕获 异常冒泡的目的
  * 5. then 中执行回调的时候要捕获异常 将其传给下一个promise
  *    如果promise状态未变更 则将回调方法添加到对应队列中
  *    如果promise状态已经变更 需要异步处理成功或者失败回调
  *    因为可能出现 回调结果和当前then返回的Promise一致 从而导致死循环问题
  * 6. catch只是then的一种特殊的写法 方便理解和使用
  * 7. finally 特点 1. 不过resolve或者reject都会执行
  *                2. 回调没有参数
  *                3. 返回一个Promise 且值可以穿透到下一个then或者catch
  * 8. Promise.resolve, Promise.reject 根据其参数返回对应的值 或者状态的Promise即可
  * 9. Proise.all 特点  1. 返回一个Promise
  *                    2. 入参是数组 resolve的情况下出参也是数组 且结果顺序和调用顺序一致
  *                    3. 所有的值或者promise都完成才能resolve 所有要计数
  *                    4. 只要有一个为reject 返回的Promise便reject
  * 10. Proise.race 特点 1. 返回一个Promise
  *                    2. 入参是数组 那么出参根据第一个成功或者失败的参数来确定
  *                    3. 只要有一个resolve 或者reject 便更改返回Promise的状态
  *
  *
*/

/*
// 初始状态
const PENDING = "pending";
// 完成状态
const FULFILLED = "fulfilled";
// 失败状态
const REJECTED = "rejected";



class MyPromise {
  status = PENDING;
  value = undefined;
  reason = undefined;
  successCallbacks = [];
  failCallbacks = [];
  constructor(exector) {
    // 立即执行传入参数
    // 参数直接写为 this.resolve  会导致函数内 this指向会发生改变
    // 异步执行状态变更
    // 捕获执行器的异常
    try {
        exector(
          (value) => asyncExecFun(() => this.resolve(value)),
          (reason) => asyncExecFun(() => this.reject(reason))
        );
    } catch (e) {
        this.reject(e)
    }
  }

  resolve(value) {
    // 如果状态已经变更则直接返回
    if (this.status !== PENDING) return;
    this.value = value;
    this.status = FULFILLED;
    // 执行所有成功回调
    while (this.successCallbacks.length) this.successCallbacks.shift()();
  }

  reject(reason) {
    // 如果状态已经变更则直接返回
    if (this.status !== PENDING) return;
    this.reason = reason;
    this.status = REJECTED;
    if(!this.failCallbacks.length){
        throw '(in MyPromise)'
    }
    // 执行所有失败回调
    while (this.failCallbacks.length) this.failCallbacks.shift()();
  }
  then(successCallback, failCallback) {
    // 成功函数处理 忽略函数之外的其他值
    successCallback =
      typeof successCallback == "function" ? successCallback : (v) => v;
    // 失败函数处理 忽略函数之外的其他值 抛出异常  实现catch冒泡的关键
    failCallback =
      typeof failCallback == "function"
        ? failCallback
        : (reason) => {
            throw reason;
          };

    let promise = new MyPromise((resolve, reject) => {
      // 统一异常处理逻辑
      const execFun = (fn, val) => {
        try {
          let res = fn(val);
          resolvePromise(promise, res, resolve, reject);
        } catch (e) {
          reject(e);
        }
      };
      // 执行成功回调
      const execSuccessCallback = () => execFun(successCallback, this.value);
      // 执行失败回调
      const execFailCallback = () => execFun(failCallback, this.reason);
      // 同步将对应成功或者失败回调事件加入对应回调队列
      if (this.status === PENDING) {
        // 将成功回调加入队列
        this.successCallbacks.push(execSuccessCallback);
        // 讲失败回调加入队列
        this.failCallbacks.push(execFailCallback);
        return;
      }
      // 延迟执行 可以将函数执行结果和当前then 返回的promise 进行比较
      asyncExecFun(() => {
        // 如果已经 fulfilled 可直接调用成功回调方法
        if (this.status === FULFILLED) {
          execSuccessCallback();
          // 如果已经 rejected 可直接调用失败回调方法
        } else if (this.status === REJECTED) {
          execFailCallback();
        }
      });
    });
    return promise;
  }

  catch(failCallback) {
    return this.then(undefined, failCallback);
  }

  finally(callback) {
    return this.then(
      // 穿透正常值
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          // 穿透异常信息
          throw reason;
        })
    );
  }

  static resolve(value) {
    // 如果是MyPromise 实例 则直接返回
    if (value instanceof MyPromise) return value;
    // 如果是MyPromise 实例 否则返回一个 MyPromise实例
    return new MyPromise((resolve) => resolve(value));
  }
  static reject(reason) {
    // 如果是MyPromise 实例 则直接返回
    if (reason instanceof MyPromise) return reason;
    // 如果是MyPromise 实例 否则返回一个 MyPromise实例
    return new MyPromise((resolve, reject) => reject(reason));
  }

  // all方法
  static all(array) {
    // 存储结果
    let result = [];
    // 存储数组长度
    let len = array.length;
    // 创建返回MyPromise
    let promise = new MyPromise((resolve, reject) => {
      // 定义当前MyPromise的索引
      let index = 0;
      // 添加数据的公用方法
      function addData(key, data) {
        // 赋值
        result[key] = data;
        // 索引递增
        index++;
        // 全部执行完则resolve
        if (index == len) {
          resolve(result);
        }
      }
      // 按顺序变量数组
      for (let i = 0; i < len; i++) {
        let curr = array[i];
        // 如果是MyPromise则 按其规则处理
        if (curr instanceof MyPromise) {
          curr.then((value) => addData(i, value), reject);
        } else {
          // 非MyPromise直接赋值
          addData(i, curr);
        }
      }
    });
    // 返回新的MyPromise实例
    return promise;
  }
  // 只要有一个成功或者失败就返回
  static race(array) {
    let promise = new MyPromise((resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        let curr = array[i];
        // MyPromise实例 结果处理
        if (curr instanceof MyPromise) {
          curr.then(resolve, reject);
        } else {
          // 非MyPromise实例处理
          resolve(curr);
        }
      }
    });
    return promise;
  }
}
*/
