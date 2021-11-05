import {TomTomTrafficClient} from '../../src/lib/TomTomTrafficClient';

describe('Testing TomTomTrafficClient', () => {
    it('Customized service number/style can be used', async () => {
        new TomTomTrafficClient('not', 'here', 10, 3, 'relative1');
    });
});
