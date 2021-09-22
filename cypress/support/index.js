// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:

const path = require('path');

import './commands'
import { setGlobalConfig } from "@storybook/testing-react";
import * as sbPreview from "../../src/.storybook/preview";

setGlobalConfig(sbPreview);
