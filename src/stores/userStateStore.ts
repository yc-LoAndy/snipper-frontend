import { defineStore } from 'pinia';

export default defineStore('useUserStateStore', {
	state: (): UserState => ({
		isAuthenticated: false,
		isLoading: false,
		userDetails: null
	}),
	actions: {
		updateAuthStatus(v: boolean) {
			this.isAuthenticated = v;
		},
		updateUserDetail(newUserDetails: UserDetailsType) {
			this.userDetails = newUserDetails;
		},
		updateLoadingStatus(isLoading: boolean) {
			this.isLoading = isLoading;
		}
	}
});
