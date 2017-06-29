#!/bin/bash

check_program() {
	if ! type $1 > /dev/null; then
		echo "$1 is not installed";
		exit;
	fi
}

check_program "nodejs";
check_program "grunt";
check_program "as3compile";
check_program "javac";
check_program "jar";
check_program "jarsigner";
check_program "pack200";
check_program "npm";

npm install

grunt dist
