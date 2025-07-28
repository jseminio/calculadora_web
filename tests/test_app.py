import os
import json
import tempfile
import unittest

import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import app

class AppTestCase(unittest.TestCase):
    def setUp(self):
        self.db_fd, self.db_path = tempfile.mkstemp()
        app.USERS_FILE = self.db_path
        with open(self.db_path, 'w') as f:
            json.dump({}, f)
        app.app.config['TESTING'] = True
        self.client = app.app.test_client()

    def tearDown(self):
        os.close(self.db_fd)
        os.remove(self.db_path)

    def test_register_login_and_calculate(self):
        # register
        resp = self.client.post('/register', data={'username':'t','password':'1'}, follow_redirects=True)
        self.assertEqual(resp.status_code, 200)
        with open(self.db_path) as f:
            data = json.load(f)
        self.assertIn('t', data)

        # login
        resp = self.client.post('/login', data={'username':'t','password':'1'}, follow_redirects=True)
        self.assertEqual(resp.status_code, 200)
        with self.client.session_transaction() as s:
            self.assertEqual(s.get('username'), 't')

        # calculate
        resp = self.client.post('/calculate', data={'expressao':'2 + 3'})
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()['resultado'], 5)
        with open(self.db_path) as f:
            data = json.load(f)
        self.assertEqual(data['t']['history'][-1]['operacao'], '2 + 3')

if __name__ == '__main__':
    unittest.main()
