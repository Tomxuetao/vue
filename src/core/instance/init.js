/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

/**
 * 定义 Vue.prototype._init 方法
 * @param Vue
 */
export function initMixin (Vue: Class<Component>) {
  /**
   * 给Vue的原型上挂载一个_init方法，负责 Vue 的初始化过程
   * @param options
   * @private
   */
  Vue.prototype._init = function (options?: Object) {
    // 获取 vue 实例
    const vm: Component = this
    // a uid
    // 每个 vue 实例都有一个 _uid，并且是依次递增的
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    // vue实例不应该是一个响应式的，做个标记
    vm._isVue = true

    /**
     * 处理组件配置项
     * 对options进行合并，vue会将相关的属性和方法都统一放到vm.$options中，为后续的调用做准备工作。
     * vm.$option 的属性来自两个方面，一个是Vue的构造函数(vm.constructor)预先定义的，一个是new Vue时传入的入参对象
     */
    if (options && options._isComponent) {
      /**
       * 如果是子组件初始化时走这里,这里只做了一些性能优化
       * 将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码的执行效率
       */
      // optimize internal component instantiation 优化内部组件实例化
      // since dynamic options merging is pretty slow, and none of the internal component options needs special treatment. 因为动态选项合并非常慢，而且内部组件选项都不需要特殊处理。
      initInternalComponent(vm, options)
    } else {
      /**
       * 合并配置项
       * 如果是根组件初始化走这里，合并 Vue 的全局配置到根组件的局部配置，比如 Vue.component 注册的全局组件会合并到 根实例的 components 选项中
       * 至于每个子组件的选项合并则发生在两个地方：
       *   1、Vue.component 方法注册的全局组件在注册时做了选项合并 (全局API)
       *   2、{ components: { xx } } 方式注册的局部组件在执行编译器生成的 render 函数时做了选项合并，包括根组件中的 components 配置  (编译器)
       */
      vm.$options = mergeOptions(
        // 这里是取到之前的默认配置，组件 指令 过滤器等 也就是构造函数的options
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    // 在非生产环境下执行了initProxy函数,参数是实例;在生产环境下设置了实例的_renderProxy属性为实例自身
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    // 设置了实例的_self属性为实例自身
    vm._self = vm
    // 初始化组件实例关系属性, 比如 $parent、$children、$root、$refs 等。不是组件生命周期mounted,created...
    initLifecycle(vm)
    /**
     * 初始化自定义事件，这里需要注意一点，所有我们在 <comp @click="handleClick" /> 上注册的事件，监听者不是父组件，
     * 而是子组件本身，也就是说事件的派发和监听者都是子组件本身，和父组件无关
     */
    initEvents(vm)
    // render初始化 初始化插槽, 获取 this.slots , 定义this._c ,也就是createElement方法,平时使用的 h 函数
    initRender(vm)
    // 调用创建之前的钩子函数  执行 beforeCreate 生命周期函数
    callHook(vm, 'beforeCreate')
    // 注入初始化  初始化  inject 选项  得到 {key:val} 形式的配置对象。并对解析结果做响应式处理 ，并代理每个 key 到 vm 实例
    initInjections(vm) // resolve injections before data/props
    // 初始化 data、props、computed、watcher
    initState(vm)
    // 解析组件配置项上的 provide 对象，将其挂载到 vm._provided 属性上
    initProvide(vm) // resolve provide after data/props
    // 调用创建完成的钩子函数  执行 created 生命周期函数
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    /**
     * 判断vm.$options有没有el  如果有 el 属性，则调用 vm.$mount 方法挂载 vm，挂载的目标就是把模板渲染成最终的 DOM
     * 存在el则默认挂载到el上 不存在的时候不挂载  需要手动挂载
     */
    if (vm.$options.el) {
      // 调用 $mount 方法，进入挂载阶段
      vm.$mount(vm.$options.el)
    }
  }
}

/**
 * 性能优化 把组件传进来的一些配置赋值到vm.$options上 打平配置对象上的属性  减少运行时原型链的查找,提高执行效率
 * @param vm 组件实例
 * @param options 传递进来的配置
 */
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  // 基于组件构造函数上的配置对象 创建vm.$options
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration. 把组件传进来的一些配置赋值到vm.$options上
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  // 如果有 render 函数, 将其赋值到vm.$options
  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}
