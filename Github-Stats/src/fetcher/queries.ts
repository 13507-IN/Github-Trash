export const USER_CALENDAR_QUERY = `
query getUserCalendar($login: String!, $from: DateTime, $to: DateTime) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            weekday
          }
        }
      }
    }
  }
}
`;

export const USER_YEARS_QUERY = `
query getUserContributionYears($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionYears
    }
  }
}
`;

export const USER_STATS_QUERY = `
query getUserStats($login: String!) {
  user(login: $login) {
    name
    login
    avatarUrl
    repositoriesContributedTo(first: 1) {
      totalCount
    }
    pullRequests(first: 1) {
      totalCount
    }
    issues(first: 1) {
      totalCount
    }
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      totalPullRequestReviewContributions
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        stargazerCount
      }
    }
  }
}
`;

export const USER_LANGUAGES_QUERY = `
query getUserLanguages($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      nodes {
        name
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`;
