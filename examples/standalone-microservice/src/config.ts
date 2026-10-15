export interface MicroserviceConfig {
  port: number;
  host: string;
  pasetoSecret: string;
  pasetoIssuer: string;
  serviceName: string;
}

export const loadConfig = (): MicroserviceConfig => ({
  port: parseInt(process.env.PORT || '4000', 10),
  host: process.env.HOST || '0.0.0.0',
  pasetoSecret: process.env.PASETO_SECRET || 'node-yalc-standalone-microservice-secret-32b',
  pasetoIssuer: process.env.PASETO_ISSUER || 'node-yalc-standalone',
  serviceName: 'node-yalc-standalone-microservice'
});
