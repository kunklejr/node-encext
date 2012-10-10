# encext

require.extensions handler for requiring encrypted files (e.g. .js,
.json).

## Installation

    $ npm install encext

## Usage

First, we encrypt some files with the included script.

    $ encext -r lib/
    Password:

Once the encryption password is entered, the above command will
recursively encrypt all `.js` and `.json` files in the `lib/` directory
and it's subdirectories. Run `encext --help` for details on the
available options.

Now that we have some encrypted source files, we need to delete the
originals prior to deployment. You will need at least one unencrypted
source file to bootstrap the process. It will include code something
like this

```javascript
require('encext').init('aes-128-cbc', 'password');
```

That one line of code will setup the encrypted extension loaders
and initialize the cipher with the given algorithm and password. This
obviously has to match the one you used when encrypting the files with
the `encext` command line tool.

## API

### init(algorithm, password)

Initializes the `encext` module with the given encryption algorithm and
derives the encryption key from the given password.

__Arguments__

* algorithm - the encryption algorithm to use. It is dependent on the
available algorithms supported by the version of OpenSSL on the platform.
Examples are 'aes-128-cbc', 'aes192', etc. On recent releases,
`openssl list-cipher-algorithms` will display the available ciphers.
* password - the password used to derive the encryption/decryption key

## License

(The MIT License)

Copyright (c) 2012 Jeff Kunkle

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
