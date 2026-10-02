import { EventNameBuilder, EventType } from '../event-name-builder';

describe('EventNameBuilder', () => {
  beforeEach(() => {
    EventNameBuilder.version = { base: 'v1', all: 'v1.**' };
  });

  afterEach(() => {
    // Reset version
    EventNameBuilder.version = undefined as any;
  });

  it('should build event names with a domain and actions', () => {
    const events = EventNameBuilder.events('user', {
      created: {
        success: EventType,
        failed: EventType,
      },
      updated: {
        success: EventType,
      },
    });

    expect(events.base).toBe('v1.user');
    expect(events.all).toBe('v1.user.**');

    expect(events.created.base).toBe('v1.user.created');
    expect(events.created.all).toBe('v1.user.created.**');
    expect(events.created.success).toBe('v1.user.created.success');
    expect(events.created.failed).toBe('v1.user.created.failed');

    expect(events.updated.base).toBe('v1.user.updated');
    expect(events.updated.all).toBe('v1.user.updated.**');
    expect(events.updated.success).toBe('v1.user.updated.success');
  });

  it('should build event names without a version if version is not set', () => {
    EventNameBuilder.version = undefined as any;

    const events = EventNameBuilder.events('user', {
      created: {
        success: EventType,
      },
    });

    expect(events.base).toBe('user');
    expect(events.all).toBe('user.**');
    expect(events.created.base).toBe('user.created');
    expect(events.created.success).toBe('user.created.success');
  });

  it('should handle custom string values instead of EventType', () => {
    const events = EventNameBuilder.events('order', {
      status: {
        paid: 'custom.paid.event',
      } as any, // Type coercion needed for testing custom values when EventType is enforced
    });

    // We coerce the type above to simulate runtime object structure or different type of actions
    expect(events.status.paid).toBe('custom.paid.event');
  });
});
