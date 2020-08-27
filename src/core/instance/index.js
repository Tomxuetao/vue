import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // new Vue() 执行this._init(options)
  this._init(options)
}

/**
 * initMixin给Vue.prototype添加：_init函数
*/
initMixin(Vue)

/**
 * stateMixin给Vue.prototype添加：
 * $data属性,
 * $props属性,
 * $set函数,
 * $delete函数,
 * $watch函数,
 * ...
*/
stateMixin(Vue)

/**
 * eventsMixin给Vue.prototype添加：
 * $on函数,
 * $once函数,
 * $off函数,
 * $emit函数,
 * $watch方法,
 ...
 */
eventsMixin(Vue)

/**
 * lifecycleMixin给Vue.prototype添加:
 * _update方法:私有方法,用于更新dom,其中调用_patch产生跟新后的dom,
 * $forceUpdate函数,
 * $destroy函数,
 */
lifecycleMixin(Vue)

/**
 * renderMixin给Vue.prototype添加:
 * $nextTick函数,
 * _render函数,
 */
renderMixin(Vue)

export default Vue
