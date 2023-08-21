type AuthUser = {
	uid: string;
	email: string;
};

type UserRole = 'client' | 'realtor' | 'admin';

type UserData = {
	firstName: string;
	lastName: string;
	role: UserRole;
	email: string;
};

type User = {
	id: string;
	data: UserData;
	idToken: any;
};

type NewPropertyData = {
	available: boolean;
	name: string;
	description: string;
	pcmGbp: number;
	sizeSqm: number;
	numRooms: number;
	// `coordinate` is identical type to `LatLng` from `react-native-maps`
	coordinate: {
		latitude: number;
		longitude: number;
	};
	creatorUserId;
};

type PropertyData = NewPropertyData & {
	createTime: number;
	creatorUserId: string;
};

type Property = {
	id: string;
	data: PropertyData;
};
