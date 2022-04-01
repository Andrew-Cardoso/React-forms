import {UserForm, User} from '.';

class FakeService {
	#id: number = 0;

	async fakeServerResponse(user: UserForm) {
		await new Promise((r) => setTimeout(r, 200));
		return {...user, id: ++this.#id} as User;
	}

	checkFormErrors(user: UserForm, checkUntouched?: false | undefined): string[];
	checkFormErrors(user: UserForm, checkUntouched: true): boolean;
	checkFormErrors(user: UserForm, checkUntouched: true, showAll: true): string[];
	checkFormErrors(user: UserForm, checkUntouched?: boolean | null, showAll?: boolean) {
		const errors: string[] = [];
		if (user.email || checkUntouched)
			!user.email?.includes('@') && errors.push('Invalid Email');
		if (user.password || checkUntouched)
			!((user.password?.length ?? 0) > 7) &&
				errors.push('Password must be at least 8 characters');
		if (user.confirmPassword || checkUntouched)
			user.password !== user.confirmPassword &&
				errors.push('Password and Confirm Password must match');
		if (user.displayName || checkUntouched)
			!user.displayName?.length && errors.push('Invalid Display Name');

		return !checkUntouched || showAll ? errors : errors.length === 0;
	}
}

export const fakeService = new FakeService();
