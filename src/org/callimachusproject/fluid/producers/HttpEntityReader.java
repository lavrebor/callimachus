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
package org.callimachusproject.fluid.producers;

import java.nio.channels.ReadableByteChannel;
import java.nio.charset.Charset;

import org.apache.http.HttpEntity;
import org.callimachusproject.fluid.FluidBuilder;
import org.callimachusproject.fluid.FluidType;
import org.callimachusproject.fluid.Producer;
import org.callimachusproject.server.helpers.ReadableHttpEntityChannel;

public class HttpEntityReader implements Producer {

	public boolean isProducable(FluidType ftype, FluidBuilder builder) {
		return HttpEntity.class.equals(ftype.asClass());
	}

	public HttpEntity produce(FluidType ftype, ReadableByteChannel in,
			Charset charset, String base, FluidBuilder builder) {
		return new ReadableHttpEntityChannel(ftype.preferred(), -1, in);
	}
}
