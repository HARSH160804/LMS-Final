import api from './api';

const courseService = {
    // Public
    getPublishedCourses: (page = 1, limit = 10) => {
        return api.get(`/course/published?page=${page}&limit=${limit}`);
    },

    searchCourses: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.query) params.set('query', filters.query);
        if (filters.level) params.set('level', filters.level);
        if (filters.priceRange) params.set('priceRange', filters.priceRange);
        if (filters.sortBy) params.set('sortBy', filters.sortBy);

        // Handle categories array
        if (filters.categories && filters.categories.length > 0) {
            filters.categories.forEach(cat => params.append('categories', cat));
        }

        return api.get(`/course/search?${params.toString()}`);
    },

    getCourseDetails: (courseId) => {
        return api.get(`/course/c/${courseId}`);
    },

    getCourseLectures: (courseId) => {
        // Returns full lectures if enrolled/instructor, preview otherwise
        return api.get(`/course/c/${courseId}/lectures`);
    },

    // Instructor
    createCourse: (formData) => {
        return api.postForm('/course', formData);
    },

    getMyCreatedCourses: () => {
        return api.get('/course');
    },

    updateCourse: (courseId, formData) => {
        return api.patchForm(`/course/c/${courseId}`, formData);
    },

    addLecture: (courseId, formData) => {
        return api.postForm(`/course/c/${courseId}/lectures`, formData);
    },

    togglePublish: (courseId) => {
        return api.patch(`/course/c/${courseId}/publish`);
    },

    deleteCourse: (courseId) => {
        return api.delete(`/course/c/${courseId}`);
    }
};

export default courseService;

