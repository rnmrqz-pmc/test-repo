import { ApiType } from '../api/index'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: ApiType,
  }
}
