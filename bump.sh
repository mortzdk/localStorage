#!/bin/bash

function bump_bower {
    search='\("version"\s*:\s*"\).\+\("\)'
	replace="\1${version}\2"
	
	sed -i".tmp" -e"s/${search}/${replace}/g" "$1"
	rm "$1.tmp"
}

function bump_js {
    search='\(@version\s*\).\+$'
	replace="\1${version}"
	
	sed -i".tmp" -e"s/${search}/${replace}/g" "$1"
	rm "$1.tmp"
}

function help {
	echo "Usage: $(basename $0) [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]"
}

if [ -z "$1" ] || [ "$1" = "help" ]; then
	help
	exit
fi

release=$1

if [ -d ".git" ]; then
    changes=$(git status --porcelain)

    if [ -z "${changes}" ]; then
		output=$(npm version ${release} --no-git-tag-version)
		version=${output:1}
        bump_bower "bower.json"
        bump_js "index.js"
        grunt dist
		git add .
		git commit -m "Bump to ${version}"
        npm publish ./
    else
        echo "Please commit staged files prior to bumping"
    fi
else
	output=$(npm version ${release} --no-git-tag-version)
	version=${output:1}
    bump_bower "bower.json"
    bump_js "index.js"
fi
