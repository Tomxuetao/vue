import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

/**
 * Vue 实际上就是一个用 Function 实现的类，我们只能通过 new Vue 去实例化它。
 * 然后它的原型 prototype 以及它本身都扩展了一系列的方法和属性。
 * @param options
 * @constructor
 */

function Vue (options) {
  // Vue 构造函数  Vue 只能通过 new 关键字初始化，然后会调用 this._init 方法
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // Vue.prototype._init方法 该方法是在 initMixin 中定义的,其入参options就是我们定义的对象时传入的参数对象
  this._init(options)
}

/**
 * 执行xxxMixin方法，初始化相关的功能定义
 * 每一个Mixin都是向Vue的原型上添加一些属性或者方法
 */

// 合并配置
initMixin(Vue)
// 初始化 data、props、computed、watcher
stateMixin(Vue)
// 初始化事件中心
eventsMixin(Vue)
// 初始化生命周期,调用声明周期钩子函数
lifecycleMixin(Vue)
// 初始化渲染
renderMixin(Vue)

export default Vue
