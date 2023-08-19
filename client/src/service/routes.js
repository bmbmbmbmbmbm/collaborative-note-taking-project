const authentication = "/authentication" 
export const authenticationUrls = {
    base: authentication,
    login: authentication + "/login",
    register: authentication + "/register",
    logout: authentication + "/logout"
}

const account = "/account"
export const accountUrls = {
    base: account,
    changePassword: account + "/change-password",
    delete: account + "/delete"
}

const entry = "/entry"
export const entryUrls = {
    base: entry,
    create: entry + "/create",
    update: entry + "/update",
    delete: entryId => entry + "/delete" + entryId,
    getUnitEntries: unitCode => entry + "/" + unitCode + "/view",
    viewEntry: entryId => entry + "/view/" + entryId,
    createEdit: entry + "/create_edit",
    edit: entryId => entry + "/edit/" + entryId,
    editSuggestions: entryId => entry + "/edit-suggestions/" + entryId,
    editDiff: entryId => entry + "/edit-diff/" + entryId,
    addReply: entry + "/add-reply",
    getReplies: entryId => entry + "/view/" + entryId + "/replies",
    getUserEntries: username => entry + "/public/" + username,
    getThisUsersEntries: username => entry + "/dashboard/" + username
}

const thread = "/threads"
export const threadUrls = {
    base: thread,
    create: thread + "/create",
    addReply: thread + "/add-reply",
    getUserThreads: username => thread + "/dashboard/" + username,
    getUnitThreads: unitCode => thread + unitCode + "/view",
    getThread: threadId => thread + "/view" + threadId,
    getThreadReplies: threadId => this.getThread(threadId) + "/replies"
}

const subject = "/subject"
export const subjectUrls = {
    base: subject,
    enrol: subject + "/enrol",
    getUserUnits: username => subject + "/get-units/" + username,
    getUserSubject: username => subject + "/get-subject/" + username,
    getUnitTitle: unitCode => subject + "/titleof/" + unitCode,
    getSubjectUnitsByUser: username => subject + username
}

export const pageUrls = {
    
}