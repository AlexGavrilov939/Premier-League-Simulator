appPath="$(docker inspect --format='{{ .Mountpoint }}' icl_app)"

if [[ -d $appPath/icl/scripts ]]
then
    PATH=$PATH:$appPath/icl/scripts
fi

if [[ -d $appPath/front/scripts ]]
then
    PATH=$PATH:$appPath/front/scripts
fi

if [[ -d $appPath/common/scripts ]]
then
    PATH=$PATH:$appPath/common/scripts
fi
