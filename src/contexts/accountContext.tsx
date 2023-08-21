/* eslint-disable no-undef */
import React from 'react';

// Types

type State = {
	authUser: AuthUser | null;
	user: User | null;
	form: any | null;
};
type Action =
	| { type: 'RESET' }
	| { type: 'SET'; payload: { authUser: AuthUser; user: User } }
	| { type: 'UPDATE'; payload: { form: any } };
type Dispatch = (action: Action) => void;

// Contexts

const AccountStateContext = React.createContext<State | undefined>(undefined);
const AccountDispatchContext = React.createContext<Dispatch | undefined>(undefined);

// Inital state

const initialState: State = {
	authUser: null,
	user: null,
	form: null,
};

// Reducer

function accountReducer(state: State, action: Action): State {
	switch (action.type) {
		case 'RESET': {
			return initialState;
		}
		case 'SET': {
			return { ...state, ...action.payload };
		}
		case 'UPDATE': {
			return { ...state, ...action.payload };
		}
		default: {
			throw new Error(`Unhandled action type: ${action!}`);
		}
	}
}

// Provider

export const AccountProvider: React.FC = React.memo(({ children }) => {
	const [state, dispatch] = React.useReducer(accountReducer, initialState);
	return (
		<AccountStateContext.Provider value={state}>
			<AccountDispatchContext.Provider value={dispatch}>
				{children}
			</AccountDispatchContext.Provider>
		</AccountStateContext.Provider>
	);
});

// Hooks

export function useAccountState(): State {
	const context = React.useContext(AccountStateContext);
	if (context === undefined) {
		throw new Error('useAccountState must be used within an AccountProvider');
	}
	return context;
}

export function useAccountDispatch(): Dispatch {
	const context = React.useContext(AccountDispatchContext);
	if (context === undefined) {
		throw new Error('useAccountDispatch must be used within an AccountProvider');
	}
	return context;
}
