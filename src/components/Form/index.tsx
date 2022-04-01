import {FormEvent, useRef, useState} from 'react';
import {fakeService} from './user.service';
import './index.css';

export interface User {
	id: number;
	email: string;
	displayName: string;
	password: string;
	about: string;
	rememberMe: boolean;
}

export interface UserForm extends Partial<Exclude<User, 'id'>> {
	confirmPassword?: string;
	errorMessages: string[];
	valid: boolean;
}

export const Form = () => {
	const [user, setUser] = useState<UserForm>({valid: false, errorMessages: []});
	const resetBtn = useRef<HTMLButtonElement>(null);

	const onChanges = (key: keyof UserForm, value: unknown) => {
		const updatedUser = {...user, [key]: value};
		updatedUser.errorMessages = fakeService.checkFormErrors(updatedUser);
		updatedUser.valid = fakeService.checkFormErrors(updatedUser, true);
		setUser(updatedUser);
	};

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (!user.valid) return;
		const createdUser = await fakeService.fakeServerResponse(user);
		console.log(createdUser);
		alert(`User ${createdUser.displayName} created with id ${createdUser.id}`);
		resetBtn.current?.click();
	};

	const resetForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		setUser({valid: false, errorMessages: []});
	};

	const showErrors = () => {
		setUser({...user, errorMessages: fakeService.checkFormErrors(user, true, true)});
	};

	const hideErrors = () => {
		setUser({...user, errorMessages: fakeService.checkFormErrors(user)});
	};

	return (
		<form onSubmit={submit}>
			<header>
				<h1>Hello There!</h1>
			</header>
			<div className='group'>
				<input
					type='text'
					placeholder=' '
					name='email'
					id='email'
					value={user.email ?? ''}
					onChange={({target}) => onChanges('email', target.value)}
				/>
				<label htmlFor='email'>Email</label>
			</div>
			<div className='group'>
				<input
					type='text'
					placeholder=' '
					name='display-name'
					id='display-name'
					value={user.displayName ?? ''}
					onChange={({target}) => onChanges('displayName', target.value)}
				/>
				<label htmlFor='display-name'>Display Name</label>
			</div>
			<div className='group'>
				<input
					type='password'
					placeholder=' '
					name='password'
					id='password'
					value={user.password ?? ''}
					onChange={({target}) => onChanges('password', target.value)}
				/>
				<label htmlFor='password'>Password</label>
			</div>
			<div className='group'>
				<input
					type='password'
					placeholder=' '
					name='confirm-password'
					id='confirm-password'
					value={user.confirmPassword ?? ''}
					onChange={({target}) => onChanges('confirmPassword', target.value)}
				/>
				<label htmlFor='confirm-password'>Confirm Password</label>
			</div>
			<div className='group text'>
				<textarea
					name='about'
					id='about'
					placeholder=' '
					maxLength={200}
					value={user.about ?? ''}
					onChange={({target}) => onChanges('about', target.value)}
				/>
				<label htmlFor='about'>
					Tell us about yourself <span>( in 200 characters at most )</span>
				</label>
			</div>
			<div className='one-line'>
				<input
					id='remember-me'
					name='remeber-me'
					type='checkbox'
					checked={user.rememberMe ?? false}
					onChange={({target}) => onChanges('rememberMe', target.checked)}
				/>
				<label htmlFor='remember-me'>
					<span></span>
					Remember me
					<ins>
						<i>Remember me</i>
					</ins>
				</label>
			</div>
			<div className='group actions'>
				<button type='reset' onClick={resetForm} ref={resetBtn}>
					Reset Form
				</button>
				<button
					type='submit'
					className={user.valid ? '' : 'disabled'}
					onMouseEnter={showErrors}
					onMouseLeave={hideErrors}
				>
					{
						<div
							className={`error-container ${
								user.errorMessages.length ? 'has-error' : ''
							}`}
						>
							{user.errorMessages.map((error) => (
								<div key={error} className='error-message'>
									{error}
								</div>
							))}
						</div>
					}
					Create Account
				</button>
			</div>
		</form>
	);
};
