export const getChannelParam = (userRole) => {
    if (['b2bAdmin', 'b2bEmployee'].includes(userRole)) {
        return 'b2b';
    }
    return 'b2c';
};

export default getChannelParam;
