export class HealthHandler {
  checkLive() {
    return {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      architecture: 'Standalone TypeScript Microservice (Zero NestJS)'
    };
  }

  checkReady() {
    return {
      status: 'READY',
      timestamp: new Date().toISOString(),
      modules: {
        '@node-yalc/auth': 'READY',
        '@node-yalc/cqrs': 'READY',
        '@node-yalc/storage': 'READY',
        '@node-yalc/resilience': 'READY',
        '@node-yalc/tracing': 'READY',
        '@node-yalc/logger': 'READY',
        '@node-yalc/errors': 'READY'
      }
    };
  }
}
