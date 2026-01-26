import api from './api';

const progressService = {
    getCourseProgress: (courseId) => {
        return api.get(`/progress/${courseId}`);
    },

    updateLectureProgress: (courseId, lectureId) => {
        // Sends empty body as per backend implementation
        return api.patch(`/progress/${courseId}/lectures/${lectureId}`, {});
    },

    markCourseAsCompleted: (courseId) => {
        return api.patch(`/progress/${courseId}/complete`);
    },

    resetCourseProgress: (courseId) => {
        return api.patch(`/progress/${courseId}/reset`);
    }
};

export default progressService;
