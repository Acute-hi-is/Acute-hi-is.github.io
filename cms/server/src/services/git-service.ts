import simpleGit, { SimpleGit } from 'simple-git';
import { JEKYLL_ROOT } from '../config.js';

const git: SimpleGit = simpleGit(JEKYLL_ROOT);

export async function getStatus() {
  const status = await git.status();
  return {
    modified: status.modified,
    created: status.created,
    deleted: status.deleted,
    not_added: status.not_added,
    staged: status.staged,
    isClean: status.isClean(),
    current: status.current,
    tracking: status.tracking,
  };
}

export async function getDiff() {
  const diff = await git.diff();
  return diff;
}

export async function stageAndCommit(message: string, files?: string[]) {
  if (files && files.length > 0) {
    await git.add(files);
  } else {
    await git.add('.');
  }
  const result = await git.commit(message);
  return result;
}

export async function push() {
  const result = await git.push('origin', 'main');
  return result;
}

export async function getLog(count: number = 10) {
  const log = await git.log({ maxCount: count });
  return log.all;
}
