from setuptools import setup, find_packages

setup(
    name="ui-debugger-pro",
    version="7.8.1",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "click",
    ],
    entry_points={
        "console_scripts": [
            "ui-debugger=ui_debugger_pro.cli:main",
        ],
    },
)
