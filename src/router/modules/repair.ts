import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/repair',
    component: Layout,
    redirect: '/repair/repair',
    meta: { title: '维护记录', icon: 'sfont system-document' },
    children: [
      {
        path: 'repair',
        component: createNameComponent(() => import('@/views/main/repair/repair.vue')),
        meta: { title: '维护记录' }
      }]
  }]

  export default route