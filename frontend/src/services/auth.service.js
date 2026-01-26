import api from './api';

const authService = {
    signup: (data) => {
        // data: { name, email, password }
        return api.post('/user/signup', data);
    },

    signin: (data) => {
        // data: { email, password }
        return api.post('/user/signin', data);
    },

    signout: () => {
        return api.post('/user/signout');
    },

    getProfile: () => {
        return api.get('/user/profile');
    },

    updateProfile: (formData) => {
        // formData support for avatar upload
        return api.patchForm('/user/profile', formData);
    },

    changePassword: (data) => {
        // data: { currentPassword, newPassword }
        return api.patch('/user/change-password', data);
    },

    deleteAccount: () => {
        return api.delete('/user/account');
    }
};

export default authService;
