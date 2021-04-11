import { Octokit } from "@octokit/rest";
import storage from './storage';

class GithubRepository {
    constructor() {
        this.settings = storage.get('github')
        if (!this.settings) {
            // To initialize value
            storage.set('github', { auth: '', owner: 'gimmi', repo: 'github-wiki-test', ref: 'heads/main' })
            throw new Error('No auth')
        }
        this.octokit = new Octokit({ auth: this.settings.auth })
        this.loadDocsPromise = this.loadDocs()
    }

    async getPaths() {
        const docs = await this.loadDocsPromise
        return Object.keys(docs)
    }

    async getContent(path) {
        const docs = await this.loadDocsPromise

        const { data: blob } = await this.octokit.rest.git.getBlob({
            owner: this.settings.owner,
            repo: this.settings.repo,
            file_sha: docs[path]
        })

        return blob.encoding === 'base64' ? window.atob(blob.content) : blob.content;
    }

    async setContent(path, content) {
        const oldCommitSha = await this.getLastCommitSha()
        const oldTreeSha = await this.getCommitTreeSha(oldCommitSha)

        const { data: { sha: newTreeSha } } = await this.octokit.rest.git.createTree({
            owner: this.settings.owner,
            repo: this.settings.repo,
            base_tree: oldTreeSha,
            tree: [{
                path: path,
                mode: '100644',
                type: 'blob',
                content: content
            }]
        })

        const { data: { sha: newCommitSha } } = await this.octokit.rest.git.createCommit({
            owner: this.settings.owner,
            repo: this.settings.repo,
            message: 'Update from editor',
            parents: [oldCommitSha],
            tree: newTreeSha,
        });

        const resp = await this.octokit.rest.git.updateRef({
            owner: this.settings.owner,
            repo: this.settings.repo,
            ref: this.settings.ref,
            sha: newCommitSha
        })

        console.log(`Updated ${this.settings.owner}/${this.settings.repo}/${this.settings.ref} status=${resp.status} commit=${newCommitSha} tree=${newTreeSha}`)
    }

    async loadDocs() {
        const commitSha = await this.getLastCommitSha()
        const treeSha = await this.getCommitTreeSha(commitSha)

        const docs = {}
        await this.appendDocsRecursive(docs, treeSha, '')
        return docs
    }

    async getLastCommitSha() {
        const { data: { object: ref } } = await this.octokit.rest.git.getRef({
            owner: this.settings.owner,
            repo: this.settings.repo,
            ref: this.settings.ref
        })

        return ref.sha
    }

    async getCommitTreeSha(commitSha) {
        const { data: { commit } } = await this.octokit.rest.repos.getCommit({
            owner: this.settings.owner,
            repo: this.settings.repo,
            ref: commitSha,
        });

        return commit.tree.sha
    }

    async appendDocsRecursive(docs, treeSha, prefix) {
        const { data } = await this.octokit.rest.git.getTree({
            owner: this.settings.owner,
            repo: this.settings.repo,
            tree_sha: treeSha
        })

        const regex = /\.(md)|(markdown)$/
        for (let it of data.tree) {
            if (it.type === 'blob' && it.path.match(regex)) {
                const path = prefix + it.path
                docs[path] = it.sha
            } else if (it.type === 'tree') {
                await this.appendDocsRecursive(docs, it.sha, it.path + '/')
            }
        }
    }
}

export default new GithubRepository()