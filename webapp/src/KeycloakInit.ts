import { KeycloakOptions, KeycloakService } from 'keycloak-angular';
import { KeycloakInitOptions } from 'keycloak-js';
import { KeycloakConfig } from 'keycloak-js';
import { environment } from './environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  const options: KeycloakOptions = {
    config: environment.keycloakConfig,
    enableBearerInterceptor: true,
    initOptions: {
      onLoad: 'check-sso',
      checkLoginIframe: false,
    },
  };
  return (): Promise<any> => keycloak.init(options);
}
