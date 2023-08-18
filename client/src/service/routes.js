export const authenticationURL = {
    base: "/authentication",
    login: this.base + "/login",
    register: this.base + "/register",
    logout: this.base + "/logout"
}

export const accountURL = {
    base: "/account",
    changePassword: this.base + "/change-password",
    delete: this.base + "/delete"
}

export const entryURL = {
    base: "/entry",
    create: this.base + "/create",
    update: this.base + "/update",
    delete: entryId => this.base + "/delete" + entryId,
    viewUnitEntries: unitCode => this.base + "/" + unitCode + "/view",
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

export const thread_url = "/threads"

export const subject_url = "/subject"

export const account_url = "/account"
export const change_password = account_url + "/change-password"
export const delete_account_url = account_url + "/delete"