#!/bin/bash

sudo kill $(ps aux | grep '[s]udo /usr/bin/python3 data' | awk '{print $2}')