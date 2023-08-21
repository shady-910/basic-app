import React from 'react';

// Types

type State = {
	available: boolean | null;
	maxPcmGbp: number | null;
	minSizeSqm: number | null;
	minNumRooms: number | null;
};
type Action =
	| { type: 'RESET' }
	| { type: 'SET_AVAILABLE'; payload: boolean | null }
	| { type: 'SET_MAX_PCM_GBP'; payload: number | null }
	| { type: 'SET_MIN_SIZE_SQM'; payload: number | null }
	| { type: 'SET_MIN_NUM_ROOMS'; payload: number | null };
type Dispatch = (action: Action) => void;

// Contexts

const FiltersStateContext = React.createContext<State | undefined>(undefined);
const FiltersDispatchContext = React.createContext<Dispatch | undefined>(undefined);

// Inital state

const initialState: State = {
	available: null,
	maxPcmGbp: null,
	minSizeSqm: null,
	minNumRooms: null,
};

// Reducer

function filtersReducer(state: State, action: Action): State {
	switch (action.type) {
		case 'RESET': {
			return initialState;
		}
		case 'SET_AVAILABLE': {
			return { ...state, available: action.payload };
		}
		case 'SET_MAX_PCM_GBP': {
			return { ...state, maxPcmGbp: action.payload };
		}
		case 'SET_MIN_SIZE_SQM': {
			return { ...state, minSizeSqm: action.payload };
		}
		case 'SET_MIN_NUM_ROOMS': {
			return { ...state, minNumRooms: action.payload };
		}
		default: {
			throw new Error(`Unhandled action type: ${action!}`);
		}
	}
}

// Provider

export const FiltersProvider: React.FC = React.memo(({ children }) => {
	const [state, dispatch] = React.useReducer(filtersReducer, initialState);
	return (
		<FiltersStateContext.Provider value={state}>
			<FiltersDispatchContext.Provider value={dispatch}>
				{children}
			</FiltersDispatchContext.Provider>
		</FiltersStateContext.Provider>
	);
});

// Hooks

export function useFiltersState(): State {
	const context = React.useContext(FiltersStateContext);
	if (context === undefined) {
		throw new Error('useFiltersState must be used within a FiltersProvider');
	}
	return context;
}

export function useFiltersDispatch(): Dispatch {
	const context = React.useContext(FiltersDispatchContext);
	if (context === undefined) {
		throw new Error('useFiltersDispatch must be used within a FiltersProvider');
	}
	return context;
}
