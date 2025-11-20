import {showTemporaryAlert} from './alerts.js';
export async function cases(res) {
    if (!res.ok) {
        switch (res.status) {
            case 403:
                showTemporaryAlert('alert', 'You do not have permission');
                break;
            case 404:
                showTemporaryAlert('alert', 'No data found');
                break;
            default:
                showTemporaryAlert('alert', 'Failed to fetch');
        }
        return false;
    }
    return true; 
}
