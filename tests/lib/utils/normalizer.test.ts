import {normalizeTimestampDBFormat} from '../../../src/lib/utils/normalizer';

describe('Testing normalizer', () => {
    it('Timestamps are normalized correctly', () => {
        normalizeTimestampDBFormat('01-01-1997T00:00Z')
    });
});
