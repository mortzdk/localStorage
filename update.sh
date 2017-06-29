#!/bin/bash

check_program() {
	if ! type $1 > /dev/null; then
		echo "$1 is not installed";
		exit;
	fi
}

check_program "ncu";

ncu -u
ncu -l -n -u -m bower -x qunit

npm update

grunt dist
