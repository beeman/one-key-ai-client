/**
 * 进一步对基础模块的导入提炼
 * 有关模块注册指导原则请参考：https://github.com/ng-alain/ng-alain/issues/180
 */
import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';

// #region global config functions

import { DelonAuthConfig } from '@delon/auth';
export function fnDelonAuthConfig(): DelonAuthConfig {
  return {
    ...new DelonAuthConfig(),
    ...{ login_url: '/auth/login' } as DelonAuthConfig
  };
}

const GLOBAL_CONFIG_PROVIDES = [
  { provide: DelonAuthConfig, useFactory: fnDelonAuthConfig },
];

function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
  }
}

@NgModule({
  imports: [
  ],
})
export class DelonModule {
  constructor(@Optional() @SkipSelf() parentModule: DelonModule) {
    throwIfAlreadyLoaded(parentModule, 'DelonModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DelonModule,
      providers: [...GLOBAL_CONFIG_PROVIDES],
    };
  }
}
