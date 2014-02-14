/*
 * Copyright (c) 2013 3 Round Stones Inc., Some Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
package org.callimachusproject.management;

import java.io.IOException;
import java.util.Map;

import javax.mail.MessagingException;

import org.callimachusproject.setup.SetupRealm;
import org.openrdf.OpenRDFException;

public interface CalliServerMXBean {

	boolean isRunning();

	void init() throws IOException, OpenRDFException;

	void start() throws IOException, OpenRDFException;

	void stop() throws IOException, OpenRDFException;

	void destroy() throws OpenRDFException, IOException;

	String getServerName() throws IOException;

	void setServerName(String name) throws IOException;

	String getPorts() throws IOException;

	void setPorts(String ports) throws IOException;

	String getSSLPorts() throws IOException;

	void setSSLPorts(String ports) throws IOException;

	boolean isStartingInProgress();

	boolean isStoppingInProgress();

	boolean isWebServiceRunning();

	boolean isSetupInProgress();

	void checkForErrors() throws Exception;

	void startWebService() throws Exception;

	void restartWebService() throws Exception;

	void stopWebService() throws Exception;

	Map<String, String> getMailProperties() throws IOException;

	void setMailProperties(Map<String, String> lines) throws IOException,
			MessagingException;

	Map<String, String> getLoggingProperties() throws IOException;

	void setLoggingProperties(Map<String, String> lines) throws IOException,
			MessagingException;

	String[] getWebappOrigins() throws IOException;

	void setWebappOrigins(String[] WebappOrigins) throws Exception;

	SetupRealm[] getRealms() throws IOException, OpenRDFException;

	void setupRealm(String realm, String webappOrigin) throws Exception;

	Map<String, String> getDatasources() throws OpenRDFException, IOException;

	String getDatasourceConfig(String uri) throws Exception;

	void setDatasourceConfig(String uri, String config) throws Exception;

	Map<String, String> getAuthenticationManagers() throws OpenRDFException,
			IOException;

	void createResource(String rdf, String systemId, String type)
			throws Exception;

	void addAuthentication(String realm, String authenticationManager)
			throws Exception;

	void removeAuthentication(String realm, String authenticationManager)
			throws Exception;

	String[] getDigestEmailAddresses(String webappOrigin)
			throws OpenRDFException, IOException;

	void inviteAdminUser(String email, String subject, String body,
			String webappOrigin) throws Exception;

	boolean registerDigestUser(String email, String password,
			String webappOrigin) throws OpenRDFException, IOException;

}
