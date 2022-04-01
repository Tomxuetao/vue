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
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 执行Vue.prototype._init(options)
  this._init(options)
}

/**
 * Vue.prototype 上挂在一些方法（_init、$set、$delete、$watch、$on、$once、$off、$emit、_update、$forceUpdate、$destroy、$nextTick、_render）
 */
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
