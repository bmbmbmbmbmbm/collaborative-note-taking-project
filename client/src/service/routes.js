export const authenticationUrls = {
    base: "/authentication",
    login: this.base + "/login",
    register: this.base + "/register",
    logout: this.base + "/logout"
}

export const accountUrls = {
    base: "/account",
    changePassword: this.base + "/change-password",
    delete: this.base + "/delete"
}

export const entryUrls = {
    base: "/entry",
    create: this.base + "/create",
    update: this.base + "/update",
    delete: entryId => this.base + "/delete" + entryId,
    getUnitEntries: unitCode => this.base + "/" + unitCode + "/view",
    viewEntry: entryId => this.base + "/view/" + entryId,
    createEdit: this.base + "/create_edit",
    edit: entryId => this.base + "/edit/" + entryId,
    editSuggestions: entryId => this.base + "/edit-suggestions/" + entryId,
    editDiff: entryId => this.base + "/edit-diff/" + entryId,
    addReply: this.base + "/add-reply",
    getReplies: entryId => this.base + "/view/" + entryId + "/replies",
    getUserEntries: username => this.base + "/public/" + username,
    getThisUsersEntries: username => this.base + "/dashboard/" + username
}

export const threadUrls = {
    base: "/threads",
    create: this.base + "/create",
    addReply: this.base + "/add-reply",
    getUserThreads: username => this.base + "/dashboard/" + username,
    getUnitThreads: unitCode => this.base + unitCode + "/view",
    getThread: threadId => this.base + "/view" + threadId,
    getThreadReplies: threadId => this.getThread(threadId) + "/replies"
}

export const subjectUrls = {
    base: "/subject",
    enrol: this.base + "/enrol",
    getUserUnits: username => this.base + "/get-units/" + username,
    getUserSubject: username => this.base + "/get-subject/" + username,
    getUnitTitle: unitCode => this.base + "/titleof/" + unitCode,
    getSubjectUnitsByUser: username => this.base + username
}